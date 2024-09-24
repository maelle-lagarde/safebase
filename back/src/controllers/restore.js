const dbManagement = require('./dbManagement');
const { exec } = require('child_process');
const path = require('path');

class Restore {
    constructor() {
        this.dbManager = new dbManagement();
    }

    // récupére le chemin d'un dump précis avec son ID.
    async getDumpPath(dumpId) {
        let backupInfo;
        try {
            await this.dbManager.connect();

            // Recherche le dump dans la table 'backup' avec l'ID spécifié
            const [rows] = await this.dbManager.connection.query('SELECT * FROM backup WHERE id = ?', [dumpId]);
            if (rows.length === 0) {
                throw new Error('Dump non trouvé.');
            }
            backupInfo = rows[0];

            // Déconnecte de la base de données
            await this.dbManager.disconnect();

            // Retourne les informations du backup trouvé
            return backupInfo;
        } catch (error) {
            console.error('Erreur lors de la récupération du chemin du dump:', error.message);
            throw error;
        }
    }

    // importe un dump précis dans une base de données de destination.
    async importToDb(dumpId, destinationDbId) {
        try {
            // Récupère les informations du dump et de la base de données de destination
            const dumpInfo = await this.getDumpPath(dumpId);
            const destinationDb = await this.dbManager.findDatabaseById(destinationDbId);

            if (!destinationDb) {
                throw new Error(`La base de données de destination avec l'ID ${destinationDbId} n'a pas été trouvée.`);
            }

            // Commande d'importation MySQL
            const importCommand = `mysql -u${destinationDb.user} -p${destinationDb.password} -h${destinationDb.host} ${destinationDb.name} < ${dumpInfo.path}`;

            // Exécute l'importation
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

    // exécute le processus complet de restauration.
    async runRestore(dumpId, destinationDbId) {
        try {
            // Étape 1 : Récupération du chemin du dump
            const dumpInfo = await this.getDumpPath(dumpId);
            console.log(`Chemin du dump récupéré: ${dumpInfo.path}`);

            // Étape 2 : Importation du dump dans la base de données de destination
            await this.importToDb(dumpId, destinationDbId);

            console.log('Restauration terminée avec succès.');
        } catch (error) {
            console.error('Erreur lors de la restauration:', error.message);
            throw error;
        }
    }
}

module.exports = Restore;