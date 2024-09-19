const mysqlConnection = require('./src/controllers/dbConnect');
const fastify = require('fastify')({ logger: true });

async function routes(fastify) {

  fastify.get('/', async (request, reply) => {
    return { message: 'Hello world' };
  });

  fastify.get('/databases', async (request, reply) => {
    return { message: 'Hello databases' };
  });

  fastify.get('/test-connection', async (request, reply) => {
    let connection;
    try {
      connection = await mysqlConnection();
      console.log('Connexion créée:', connection.config);

      if (!connection) {
        throw new Error('La connexion à la base de données est invalide.');
      }

      const [rows] = await connection.query('SHOW TABLES');

      reply.send({ message: 'Connexion réussie', result: rows });
    } catch (err) {
      console.error('Erreur de connexion à MySQL:', err.stack);
      reply.status(500).send({ 
        error: 'Erreur de connexion à MySQL',
        details: err.message 
      });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  });
}

module.exports = routes;