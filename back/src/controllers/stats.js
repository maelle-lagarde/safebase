const dbManagement = require('./dbManagement');

class Stats {
    constructor() {
        this.dbManager = new dbManagement();
    }

    // compte le nombre de bases de données
    async countDatabases() {
        try {
            await this.dbManager.connect();
            const [rows] = await this.dbManager.connection.query('SELECT COUNT(*) AS count FROM db_info');
            await this.dbManager.disconnect();
            return rows[0].count;
        } catch (error) {
            console.error('Erreur lors du comptage des databases:', error.message);
            throw error;
        }
    }

    // compte le nombre de restaurations
    async countRestores() {
        try {
            await this.dbManager.connect();
            const [rows] = await this.dbManager.connection.query('SELECT COUNT(*) AS count FROM restore');
            await this.dbManager.disconnect();
            return rows[0].count;
        } catch (error) {
            console.error('Erreur lors du comptage des restaurations:', error.message);
            throw error;
        }
    }

    // compte le nombre de backups
    async countBackups() {
        try {
            await this.dbManager.connect();
            const [rows] = await this.dbManager.connection.query('SELECT COUNT(*) AS count FROM backup');
            await this.dbManager.disconnect();
            return rows[0].count;
        } catch (error) {
            console.error('Erreur lors du comptage des backups:', error.message);
            throw error;
        }
    }
}

module.exports = Stats;
