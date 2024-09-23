const dbManagement = require('./dbManagement');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class Backup {
    constructor() {
        this.dbManager = new dbManagement();
    }

    async showBackups() {
        try {
            const query = 'SELECT * FROM backup;';
            await this.dbManager.connect();
            const [rows] = await this.dbManager.connection.query(query);
            await this.dbManager.disconnect();

            return rows; // Retourne les résultats
        } catch (error) {
            console.error('Erreur lors de la récupération des backups:', error);
            throw error;
        }
    }

    async runBackup(id, destinationDbName) {
        try {
            const dbInfo = await this.dbManager.findDatabaseById(id);

            if (!dbInfo) {
                throw new Error(`La base de données avec l'ID ${id} n'a pas été trouvée.`);
            }

            const backupDir = path.join(__dirname, '../../backup');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
                console.log(`Répertoire de sauvegarde créé: ${backupDir}`);
            }

            const dumpFileName = `${dbInfo.name}_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
            const dumpFilePath = path.join(backupDir, dumpFileName);

            const dumpCommand = `mysqldump -u${dbInfo.user} -p${dbInfo.password} -h${dbInfo.host} ${dbInfo.name} > ${dumpFilePath}`;

            exec(dumpCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur lors du dump SQL: ${error.message}`);
                    throw error;
                }
                console.log(`Dump SQL créé avec succès: ${dumpFilePath}`);

                this.importToDestination(dbInfo, destinationDbName, dumpFilePath);
            });
        } catch (error) {
            console.error(`Erreur lors du backup: ${error.message}`);
            throw error;
        }
    }

    importToDestination(dbInfo, destinationDbName, dumpFilePath) {
        const importCommand = `mysql -u${dbInfo.user} -p${dbInfo.password} -h${dbInfo.host} ${destinationDbName} < ${dumpFilePath}`;

        exec(importCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de l'importation du dump dans la base de données ${destinationDbName}: ${error.message}`);
                throw error;
            }
            console.log(`Fichier dump importé avec succès dans la base de données ${destinationDbName}.`);

            this.saveDumpPath(dumpFilePath, dbInfo.name, destinationDbName);
        });
    }

    async saveDumpPath(filePath, dbNameSaved, dbNameDestination) {
        try {
            const query = 'INSERT INTO backup (path, date, db_name_saved, db_name_destination) VALUES (?, NOW(), ?, ?)';
            await this.dbManager.connect();
            await this.dbManager.connection.query(query, [filePath, dbNameSaved, dbNameDestination]);
            await this.dbManager.disconnect();

            console.log(`Le chemin de sauvegarde a été enregistré dans la table backup.`);
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du chemin de sauvegarde:', error);
            throw error;
        }
    }
}

module.exports = Backup;