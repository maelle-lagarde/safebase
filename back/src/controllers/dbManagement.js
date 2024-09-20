const Database = require('./dbConnect');

class dbManagement extends Database {
    constructor() {
        super();
    }

    // SHOW all databases
    async  findDatabases(){
        try {
            await this.connect();

            const [rows] = await this.connection.query('SELECT id, user, host, name, port, type FROM db_info');
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

    // SELECT database by id
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

    // CREATE new database.
    async createDb({ user, host, name, port, type, password }) {
        try {
            await this.connectToServer();
    
            // Créer la base de données
            const createDbQuery = `CREATE DATABASE IF NOT EXISTS \`${name}\`;`;
            await this.connection.query(createDbQuery);
            console.log(`Base de données ${name} créée avec succès.`);
    
            // Créer l'utilisateur
            const createUserQuery = `CREATE USER IF NOT EXISTS '${user}'@'${host}' IDENTIFIED BY '${password}';`;
            await this.connection.query(createUserQuery);
            console.log(`Utilisateur ${user} créé avec succès.`);
    
            // Accorder les privilèges
            const grantPrivilegesQuery = `GRANT ALL PRIVILEGES ON \`${name}\`.* TO '${user}'@'${host}';`;
            await this.connection.query(grantPrivilegesQuery);
            console.log(`Privilèges accordés à l'utilisateur ${user} sur la base de données ${name}.`);
    
            return { message: `Base de données ${name} créée avec succès avec l'utilisateur ${user} sur l'hôte ${host}.` };
        } catch (error) {
            console.error('Erreur lors de la création de la base de données ou de l’utilisateur:', error);
            throw error;
        } finally {
            if (this.connection) {
                await this.disconnect();
                console.log('Connexion fermée.');
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
