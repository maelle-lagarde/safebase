const Database = require('./dbConnect');

class dbManagement extends Database {
    constructor() {
        super();
    }

    // SHOW all databases info from db_info
    async  findDatabases() {
        try {
            await this.connect();

            const [rows] = await this.connection.query('SELECT id, user, host, name, port, type FROM db_info');
            // console.log(rows);

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

    async findDatabaseByName(name) {
        try {
            const query = 'SELECT * FROM db_info WHERE name = ?;';
            await this.connect();
            const [rows] = await this.connection.query(query, [name]);
            await this.disconnect();
    
            if (rows.length === 0) {
                return null;
            }
    
            return rows[0];
        } catch (error) {
            console.error('Erreur lors de la recherche de la base de données par nom:', error);
            throw error;
        }
    }
    
    // SELECT database by id
    async findDatabaseById(id) {
        // console.log('Database ID:', request.params.id);
        try {
            await this.connect();
            // const [rows] = await this.connection.query('SELECT * FROM db_info WHERE id = ?', [id]);
            const [rows] = await this.connection.query('SELECT * FROM db_info WHERE id = 24');
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

    // INSERT new database info in db_info
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
    
            const createDbQuery = `CREATE DATABASE IF NOT EXISTS \`${name}\`;`;
            await this.connection.query(createDbQuery);
            console.log(`Base de données ${name} créée avec succès.`);
    
            const createUserQuery = `CREATE USER IF NOT EXISTS '${user}'@'${host}' IDENTIFIED BY '${password}';`;
            await this.connection.query(createUserQuery);
            console.log(`Utilisateur ${user} créé avec succès.`);
    
            const grantPrivilegesQuery = `GRANT ALL PRIVILEGES ON \`${name}\`.* TO '${user}'@'${host}';`;
            await this.connection.query(grantPrivilegesQuery);
            console.log(`Privilèges accordés à l'utilisateur ${user} sur la base de données ${name}.`);
    
            // Flush privileges
            await this.connection.query('FLUSH PRIVILEGES;');
            console.log('Privilèges rafraîchis.');
    
            await this.addDatabase({ user, host, name, port, type, password });
            console.log(`Informations ajoutées dans db_info pour la base de données ${name}.`);
    
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
    async deleteDatabase(id) {
        let dbInfo;
        try {
            await this.connect();
            
            const [rows] = await this.connection.query('SELECT * FROM db_info WHERE id = ?', [id]);
            if (rows.length === 0) {
                throw new Error('Database not found');
            }
            dbInfo = rows[0];

            // delete row from db_info.
            const deleteQuery = 'DELETE FROM db_info WHERE id = ?';
            const [result] = await this.connection.query(deleteQuery, [id]);
            console.log('Database entry deleted from db_info:', result);

            await this.connectToServer();

            // delete database from server.
            const dropDbQuery = `DROP DATABASE IF EXISTS \`${dbInfo.name}\`;`;
            await this.connection.query(dropDbQuery);
            console.log(`Base de données ${dbInfo.name} supprimée avec succès.`);

            return result;
        } catch (error) {
            console.error('Error deleting database:', error);
            throw error;
        } finally {
            if (this.connection) {
                await this.disconnect();
            }
        }
    }
}

module.exports = dbManagement;
