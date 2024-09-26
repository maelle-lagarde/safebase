const dbManagement = require('./dbManagement');
const Backup = require('./backup');
const cron = require('node-cron');

class Cron {
    constructor() {
        this.dbManager = new dbManagement();
        this.backupManager = new Backup();
    }

    // enregistre l'exécution d'un cron dans la table cron
    async saveCron(db_name, cronFormat) {
        try {
            await this.dbManager.connect();
            const query = 'INSERT INTO cron (db_name, cron_format) VALUES (?, ?)';
            await this.dbManager.connection.query(query, [db_name, cronFormat]);
            await this.dbManager.disconnect();
            console.log(`Exécution du cron enregistrée pour la base: ${db_name}`);
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de l\'exécution du cron:', error);
            throw error;
        }
    }

    // exécute un cron toutes les minutes
    async runCronMinutes(id) {
        cron.schedule('* * * * *', async () => {
            try {
                console.log('Vérification des crons à exécuter chaque minute...', this);

                const dbId = await this.dbManager.findDatabaseById(id);
                console.log(`Exécution du cron toutes les minutes pour : ${dbId}`);

                await this.backupManager.runBackup(dbId);
                await this.saveCron(id, '* * * * *');
            } catch (error) {
                console.error('Erreur lors de l\'exécution du cron minute:', error);
            }
        });
    }

    // exécute un cron toutes les heures
    async runCronHours(id) {
        cron.schedule('0 * * * *', async () => {
            try {
                console.log('Vérification des crons à exécuter chaque heure...');

                const dbId = await this.dbManager.findDatabaseById(id);
                console.log(`Exécution du cron toutes les heures pour : ${dbId}`);

                await this.backupManager.runBackup(dbId);
                await this.saveCron(id, '0 * * * *');
            } catch (error) {
                console.error('Erreur lors de l\'exécution du cron heure:', error);
            }
        });
    }

    // exécute un cron tous les jours à 7:00
    async runCronDays(id) {
        cron.schedule('0 7 * * *', async () => {
            try {
                console.log('Vérification des crons à exécuter chaque jour à 7h00...');

                const dbId = await this.dbManager.findDatabaseById(id);
                console.log(`Exécution du cron tous les jours à 7:00 pour : ${dbId}`);

                await this.backupManager.runBackup(dbId);
                await this.saveCron(id, '0 7 * * *');
            } catch (error) {
                console.error('Erreur lors de l\'exécution du cron jour:', error);
            }
        });
    }

    // supprime un cron de la table cron.
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