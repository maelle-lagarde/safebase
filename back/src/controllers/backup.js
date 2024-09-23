const dbManagement = require('./dbManagement');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class Backup {
    constructor() {
        this.dbManager = new dbManagement(); // Créer une instance de dbManagement
    }

    async runBackup(id, destinationDbName) {
        try {
            // Étape 1: Trouver la base de données source à sauvegarder par ID
            const dbInfo = await this.dbManager.findDatabaseById(id);

            if (!dbInfo) {
                throw new Error(`La base de données avec l'ID ${id} n'a pas été trouvée.`);
            }

            // Étape 2: Vérifier que le répertoire de sauvegarde existe, sinon le créer
            const backupDir = path.join(__dirname, '../../backup');  // Mettre le chemin correct ici
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
                console.log(`Répertoire de sauvegarde créé: ${backupDir}`);
            }

            // Étape 3: Effectuer un dump SQL de la base de données source
            const dumpFileName = `${dbInfo.name}_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
            const dumpFilePath = path.join(backupDir, dumpFileName);

            // Commande mysqldump pour créer un fichier de sauvegarde
            const dumpCommand = `mysqldump -u${dbInfo.user} -p${dbInfo.password} -h${dbInfo.host} ${dbInfo.name} > ${dumpFilePath}`;

            // Exécution de la commande de dump
            exec(dumpCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur lors du dump SQL: ${error.message}`);
                    throw error;
                }
                console.log(`Dump SQL créé avec succès: ${dumpFilePath}`);

                // Étape 4: Importer le fichier dump dans la base de données de destination
                this.importToDestination(dbInfo, destinationDbName, dumpFilePath);
            });
        } catch (error) {
            console.error(`Erreur lors du backup: ${error.message}`);
            throw error;
        }
    }

    // Importer le dump dans la base de données de destination
    importToDestination(dbInfo, destinationDbName, dumpFilePath) {
        // Commande MySQL pour importer le fichier .sql dans la base de données de destination
        const importCommand = `mysql -u${dbInfo.user} -p${dbInfo.password} -h${dbInfo.host} ${destinationDbName} < ${dumpFilePath}`;

        exec(importCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de l'importation du dump dans la base de données ${destinationDbName}: ${error.message}`);
                throw error;
            }
            console.log(`Fichier dump importé avec succès dans la base de données ${destinationDbName}.`);

            // Étape 5: Sauvegarder le chemin du dump dans la table backup
            this.saveDumpPath(dumpFilePath, dbInfo.name, destinationDbName);
        });
    }

    // Sauvegarder le chemin du dump dans la table "backup"
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