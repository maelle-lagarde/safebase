const Database = require('./dbConnect');

class dbManagement extends Database {
    constructor() {
        super();
    }

    // SHOW all databases
    async  findDatabases(){
        try {
            await this.connect();

            const [rows] = await this.connection.query('SHOW DATABASES');
            console.log(rows);

            await this.disconnect();
            return rows;
        } catch (error) {
            console.error('Error fetching data from database:', error);
            throw error; 
        } finally {
            if (this.connection) {
                await this.disconnect();
            }
        }
    }

    // SELECT databases by id
    async findDatabaseById(id) {
        // console.log('Database ID:', request.params.id);
        try {
            await this.connect();
            const [rows] = await this.connection.query('SELECT * FROM db_info WHERE id = ?', [id]);
            await this.disconnect();
            return rows[0];
        } catch (error) {
            console.error('Error fetching database by ID:', error);
            throw error;
        } finally {
            if (this.connection) {
                await this.disconnect();
            }
        }
    }

    // INSERT new database
    async addDatabase({ user, host, name, port, type, password }) {
        try {
            await this.connect();
            const [result] = await this.connection.query('INSERT INTO db_info (user, host, name, port, type, password) VALUES (?, ?, ?, ?, ?, ?)', [user, host, name, port, type, password]);
            console.log('Database added:', result);
            return { id: result.insertId, ...{ user, host, name, port, type, password } };
        } catch (error) {
            console.error('Error adding database:', error);
            throw error;
        } finally {
            if (this.connection) {
                await this.disconnect();
            }
        }
    }

    // UPDATE database by id
    async updateDatabase(id, { user, host, name, port, type, password }) {
        try {
            await this.connect();
    
            const updateQuery = `
            UPDATE db_info
            SET user = ?, host = ?, name = ?, port = ?, type = ?, password = ?
            WHERE id = ?
        `;
        const [updateResult] = await this.connection.query(updateQuery, [user, host, name, port, type, password, id]);

        if (updateResult.affectedRows === 0) {
            throw new Error(`No database found with id ${id}`);
        }

        const selectQuery = 'SELECT * FROM db_info WHERE id = ?';
        const [rows] = await this.connection.query(selectQuery, [id]);

        console.log('Database updated and specific row retrieved:', rows);
        return rows[0];
        } catch (error) {
            console.error('Error updating data in database:', error);
            throw error;
        } finally {
            if (this.connection) {
                await this.disconnect();
            }
        }
    }

    // DELETE database by id 
    async deleteDatabse(id) {
        try {
            await this.connect();
            const deleteQuery = 'DELETE FROM db_info WHERE id = ?';
            const [result] = await this.connection.query(deleteQuery, [id]);

            console.log('Database deleted:', result);
            return result;
        } catch (error) {
            console.error('Error deleting data from database:', error);
            throw error;
        } finally {
            if (this.connection) {
                await this.disconnect();
            }
        }
    }
}

module.exports = dbManagement;
