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

    async runBackup(id) {
        try {
            // récupére les informations de la base de données source par son ID
            const dbInfoSource = await this.dbManager.findDatabaseById(id);
    
            if (!dbInfoSource) {
                throw new Error(`La base de données avec l'ID ${id} n'a pas été trouvée.`);
            }
    
            // crée un répertoire de sauvegarde s'il n'existe pas
            const backupDir = path.join(__dirname, '../../backup');
            if (!fs.existsSync(backupDir)) {
                fs.mkdirSync(backupDir, { recursive: true });
                console.log(`Répertoire de sauvegarde créé: ${backupDir}`);
            }
    
            // défini le nom et le chemin du fichier dump
            const dumpFileName = `${dbInfoSource.name}_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
            const dumpFilePath = path.join(backupDir, dumpFileName);
    
            // exécute la commande de dump
            const dumpCommand = `mysqldump -u${dbInfoSource.user} -p${dbInfoSource.password} -h${dbInfoSource.host} ${dbInfoSource.name} > ${dumpFilePath}`;
    
            await this.executeCommand(dumpCommand);
            console.log(`Dump SQL créé avec succès: ${dumpFilePath}`);
    
            // enregistre le chemin du dump dans la base de données
            await this.saveDumpPath(dumpFilePath, dbInfoSource.name);

        } catch (error) {
            console.error(`Erreur lors du backup: ${error.message}`);
            throw error;
        }
    }

    async saveDumpPath(filePath, dbNameSaved) {
        try {
            const query = 'INSERT INTO backup (path, date, db_name_saved) VALUES (?, NOW(), ?)';
            await this.dbManager.connect();
            await this.dbManager.connection.query(query, [filePath, dbNameSaved]);
            await this.dbManager.disconnect();

            console.log(`Le chemin de sauvegarde a été enregistré dans la table backup.`);
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du chemin de sauvegarde:', error);
            throw error;
        }
    }
}

module.exports = Backup;