const dbManagement = require('./dbManagement');
const { exec } = require('child_process');
const path = require('path');

class Restore {
    constructor() {
        this.dbManager = new dbManagement();
    }

    async getDumpPath(dumpId) {
        let backupInfo;
        try {
            await this.dbManager.connect();
            const [rows] = await this.dbManager.connection.query('SELECT * FROM backup WHERE id = ?', [dumpId]);
            if (rows.length === 0) {
                throw new Error('Dump non trouvé.');
            }
            backupInfo = rows[0];
            await this.dbManager.disconnect();
            return backupInfo;
        } catch (error) {
            console.error('Erreur lors de la récupération du chemin du dump:', error.message);
            throw error;
        }
    }

    async importToDb(dumpId, destinationDbId) {
        try {
            const dumpInfo = await this.getDumpPath(dumpId);
            const destinationDb = await this.dbManager.findDatabaseById(destinationDbId);

            if (!destinationDb) {
                throw new Error(`La base de données de destination avec l'ID ${destinationDbId} n'a pas été trouvée.`);
            }

            const importCommand = `mysql -u${destinationDb.user} -p${destinationDb.password} -h${destinationDb.host} ${destinationDb.name} < ${dumpInfo.path}`;

            exec(importCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur lors de l'importation du dump dans ${destinationDb.name}: ${error.message}`);
                    throw error;
                }
                console.log(`Le dump a été importé avec succès dans la base de données ${destinationDb.name}.`);
            });
        } catch (error) {
            console.error('Erreur lors de l\'importation du dump:', error.message);
            throw error;
        }
    }

    async runRestore(dumpId, destinationDbId) {
        try {
            // Étape 1 : Récupération du chemin du dump
            const dumpInfo = await this.getDumpPath(dumpId);
            console.log(`Chemin du dump récupéré: ${dumpInfo.path}`);
    
            // Étape 2 : Importation du dump dans la base de données de destination
            const destinationDb = await this.dbManager.findDatabaseById(destinationDbId);
            await this.importToDb(dumpId, destinationDbId);
    
            // Étape 3 : Enregistrer le chemin du restore dans la table
            if (destinationDb) {
                await this.saveRestorePath(dumpInfo.path, destinationDb.name);
            } else {
                throw new Error(`La base de données de destination avec l'ID ${destinationDbId} n'a pas été trouvée.`);
            }
    
            console.log('Restauration terminée avec succès.');
        } catch (error) {
            console.error('Erreur lors de la restauration:', error.message);
            throw error;
        }
    }
    

    async showRestores() {
        try {
            await this.dbManager.connect();
            const [rows] = await this.dbManager.connection.query('SELECT * FROM restore');
            await this.dbManager.disconnect();
            console.log('Restores:', rows);
            return rows;
        } catch (error) {
            console.error('Erreur lors de l\'affichage des restores:', error.message);
            throw error;
        }
    }

    async saveRestorePath(restorePath, dbName) {
        try {
            console.log(`Enregistrement du chemin: ${restorePath} et de la base de données: ${dbName}`);
            await this.dbManager.connect();
            const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            await this.dbManager.connection.query('INSERT INTO restore (path, db_name_restored, date) VALUES (?, ?, ?)', [restorePath, dbName, currentDateTime]);
            await this.dbManager.disconnect();
            console.log('Chemin de restauration enregistré avec succès.');
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du chemin de restauration:', error.message);
            throw error;
        }
    }
    
}

module.exports = Restore;