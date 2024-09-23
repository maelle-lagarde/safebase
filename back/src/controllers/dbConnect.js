const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

class Database {
  constructor() {
    this.connection = null;
  }

  // connect to server.
  async connectToServer() {
    try {
        this.connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
            port: process.env.DB_PORT || 3306,
        });

        console.log('Connecté au server MySQL');

        // test connexion.
        await this.connection.query('SELECT 1');
        console.log('La connexion au serveur MySQL est opérationnelle.');
    } catch (err) {
        console.error('Erreur lors de la connexion au server MySQL:', err.message, err.stack);
        throw err;
    }
}


  // connect to safebase.
  async connect() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'safebase',
        port: process.env.DB_PORT || 3306,
      });

      console.log('Connecté à la base de données MySQL');
    } catch (err) {
      console.error('Erreur lors de la connexion à MySQL:', err.message, err.stack);
      throw err;
    }
  }

  // disconnect to safebase.
  async disconnect() {
    try {
      if (this.connection) {
        await this.connection.end();
        console.log('Déconnexion de la base de données MySQL réussie');
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion de MySQL:', err.stack);
    }
  }
}

module.exports = Database;


// connexion à une bdd postgres
// async function postgresConnection() {
//     const client = new Client({
//       host: process.env.PG_HOST,
//       user: process.env.PG_USER,
//       password: process.env.PG_PASSWORD,
//       database: process.env.PG_DATABASE,
//       port: process.env.PG_PORT || 5432,
//     });
  
//     try {
//       await client.connect();
//       console.log('Connecté à la base de données PostgreSQL');
//       return client;
//     } catch (err) {
//       console.error('Erreur lors de la connexion à PostgreSQL:', err.stack);
//       throw err;
//     }
// }
  
// module.exports = postgresConnection;

// // déconnexion à une bdd postgres
// async function postgresDeconnection(client) {
//     try {
//       await client.end();
//       console.log('Déconnexion de la base de données PostgreSQL réussie');
//     } catch (err) {
//       console.error('Erreur lors de la déconnexion de PostgreSQL:', err.stack);
//     }
// }
  
// module.exports = postgresDeconnection;