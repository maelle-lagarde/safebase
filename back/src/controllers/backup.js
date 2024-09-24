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

            return rows;
        } catch (error) {
            console.error('Erreur lors de la récupération des backups:', error);
            throw error;
        }
    }

    // Fonction utilitaire pour exécuter une commande shell
    executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur lors de l'exécution de la commande: ${error.message}`);
                    reject(error);
                } else {
                    resolve(stdout);
                }
            });
        });
    }

    async runBackup(id, destinationDbName) {
        try {
            // Récupérer les informations de la base de données source par son ID
            const dbInfoSource = await this.dbManager.findDatabaseById(id);
    
            if (!dbInfoSource) {
                throw new Error(`La base de données avec l'ID ${id} n'a pas été trouvée.`);
            }
    
            // Récupérer les informations de la base de données de destination par son nom
            const dbInfoDestination = await this.dbManager.findDatabaseByName(destinationDbName); // Récupérer la bdd par son nom
    
            if (!dbInfoDestination) {
                throw new Error(`La base de données de destination ${destinationDbName} n'a pas été trouvée.`);
            }
    
            // Créer un répertoire de sauvegarde s'il n'existe pas
            const backupDir = path.join(__dirname, '../../backup');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
                console.log(`Répertoire de sauvegarde créé: ${backupDir}`);
            }
    
            // Définir le nom et le chemin du fichier dump
            const dumpFileName = `${dbInfoSource.name}_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
            const dumpFilePath = path.join(backupDir, dumpFileName);
    
            // Exécuter la commande de dump
            const dumpCommand = `mysqldump -u${dbInfoSource.user} -p${dbInfoSource.password} -h${dbInfoSource.host} ${dbInfoSource.name} > ${dumpFilePath}`;
    
            exec(dumpCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur lors du dump SQL: ${error.message}`);
                    throw error;
                }
                console.log(`Dump SQL créé avec succès: ${dumpFilePath}`);
    
                // Après la création du dump, importer dans la base de données de destination
                this.importToDestination(dbInfoSource, dbInfoDestination.name, dumpFilePath); // Utiliser le nom de la base de destination ici
            });
        } catch (error) {
            console.error(`Erreur lors du backup: ${error.message}`);
            throw error;
        }
    }    
    

    async importToDestination(dbInfo, destinationDbName, dumpFilePath) {
        const importCommand = `mysql -u${dbInfo.user} -p${dbInfo.password} -h${dbInfo.host} ${destinationDbName} < ${dumpFilePath}`;

        // Attendre que l'importation soit terminée
        await this.executeCommand(importCommand);
        console.log(`Fichier dump importé avec succès dans la base de données ${destinationDbName}.`);

        // Enregistrer le chemin du dump dans la base de données
        await this.saveDumpPath(dumpFilePath, dbInfo.name, destinationDbName);
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