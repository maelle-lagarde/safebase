const dbManagement = require('./dbManagement');
const Backup = require('./backup');
const cron = require('node-cron');

class Cron {
    constructor() {
        this.dbManager = new dbManagement();
        this.backupManager = new Backup();
    }

    // enregistre l'exécution d'un cron dans la base de données.
    async saveCron(dbName, cronFormat) {
        try {
            await this.dbManager.connect();
            const query = 'INSERT INTO cron (db_name, cron_format) VALUES (?, ?)';
            await this.dbManager.connection.query(query, [dbName, cronFormat]);
            await this.dbManager.disconnect();
            console.log(`Exécution du cron enregistrée pour la base: ${dbName}`);
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de l\'exécution du cron:', error);
            throw error;
        }
    }

    // exécute un cron toutes les minutes.
    async runCronMinutes(dbName) {
        cron.schedule('* * * * *', async () => {
            console.log('Vérification des crons à exécuter chaque minute...');

            console.log(`Exécution du cron toutes les minutes pour : ${dbName}`);
            await this.backupManager.runBackup(dbName); // Appel de la méthode runBackup
            await this.saveCron(dbName, '* * * * *');
        });
    }

    // exécute un cron toutes les heures.
    async runCronHours(dbName) {
        cron.schedule('0 * * * *', async () => {
            console.log('Vérification des crons à exécuter chaque heure...');

            console.log(`Exécution du cron toutes les heures pour : ${dbName}`);
            await this.backupManager.runBackup(dbName);
            await this.saveCron(dbName, '0 * * * *');
        });
    }

    // exécute un cron tous les jours à 7:00.
    async runCronDays(dbName) {
        cron.schedule('0 7 * * *', async () => {
            console.log('Vérification des crons à exécuter chaque jour à 7h00...');

            console.log(`Exécution du cron tous les jours à 7:00 pour : ${dbName}`);
            await this.backupManager.runBackup(dbName);
            await this.saveCron(dbName, '0 7 * * *');
        });
    }

    // supprime un cron de la base de données.
    async deleteCron(id) {
        try {
            await this.dbManager.connect();
            const result = await this.dbManager.connection.query('DELETE FROM cron WHERE id = ?', [id]);
            await this.dbManager.disconnect();

            if (result[0].affectedRows === 0) {
                console.log(`Aucun cron avec l'ID ${id} n'a été trouvé.`);
            } else {
                console.log(`Cron avec l'ID ${id} supprimé.`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du cron:', error);
            throw error;
        }
    }

    // récupère tous les crons enregistrés dans la table cron.
    async getCrons() {
        try {
            await this.dbManager.connect();
            const [rows] = await this.dbManager.connection.query('SELECT * FROM cron');
            await this.dbManager.disconnect();
            return rows;
        } catch (error) {
            console.error('Erreur lors de la récupération des crons:', error);
            throw error;
        }
    }
}

module.exports = Cron;