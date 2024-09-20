const dbManagement = require('./src/controllers/dbManagement');
const fastify = require('fastify')({ logger: true });

async function routes(fastify) {

  fastify.get('/', async (request, reply) => {
    return { message: 'Hello world' };
  });


  // afficher toutes les databases enregistrées. 
  fastify.get('/databases', async (request, reply) => {
    const databases = new dbManagement();
    try {
      const dbList = await databases.findDatabases();
      console.log(dbList);
      reply.send(dbList);
    } catch (err) {
      console.error('Error fetching databases:', err);
      reply.status(500).send({ error: err.message });
    }
  });

  fastify.post('/create-database', async (request, reply) => {
    const database = new dbManagement();
    try {
        const { user, host, name, port, type, password } = request.body;

        // Vérifier les champs requis
        if (!user || !host || !name || !port || !type || !password) {
            return reply.status(400).send({ error: 'Missing required fields' });
        }

        // Appeler directement createDb
        const addDb = await database.createDb({ user, host, name, port, type, password });
        console.log(addDb);
        reply.send(addDb);
    } catch (err) {
        console.error('Error creating database', err);
        reply.status(500).send({ error: err.message });
    }
  });

  // afficher une base de données spécifique. 
  fastify.get('/databases/:id', async (request, reply) => {
    const database = new dbManagement();
    try {
      const dbId = request.params.id;
      const db = await database.findDatabaseById(dbId);
      console.log(db);
      reply.send(db);
    } catch (err) {
      console.error('Error fetching database id:', err);
      reply.status(500).send({ error: err.message });
    }
  });

  // ajouter une base de données.
  fastify.post('/databases', async (request, reply) => {
    const database = new dbManagement();
    try {
      const { user, host, name, port, type, password } = request.body;
        if (!user || !host || !name || !port || !type || !password) {
            return reply.status(400).send({ error: 'Missing required fields' });
        }
      const addDb = await database.addDatabase({ user, host, name, port, type, password });
      console.log(addDb);
      reply.send(addDb);
    } catch (err) {
      console.error('Error adding database', err);
      reply.status(500).send({ error: err.message });
    }
  });

  // éditer une base de données.
  fastify.put('/database/update/:id', async (request, reply) => {
    const database = new dbManagement();
    try {
      const dbId = request.params.id;
      const { user, host, name, port, type, password } = request.body;
      if (!user || !host || !name || !port || !type || !password) {
        reply.status(400).send({ error: 'Missing required fields' });
        return;
      }
      const db = await database.updateDatabase(dbId, { user, host, name, port, type, password });
      console.log(db);
      reply.send(db);
    } catch (err) {
      console.error('Error fetching database id:', err);
      reply.status(500).send({ error: err.message });
    }
  });

  // supprimer une base de données.
  fastify.delete('/database/delete/:id', async (request, reply) => {
    const database = new dbManagement();
    const dbId = request.params.id;
    try {
      const result = await database.deleteDatabse(dbId);
      if (result.affectedRows === 0) {
        reply.status(404).send({ message: 'Database not found' });
      } else {
        reply.send({ message: 'Database deleted successfully' });
      }
    } catch (err) {
        console.error('Error deleting database:', err);
        reply.status(500).send({ error: err.message });
    }
  });
}

module.exports = routes;