const dbManagement = require('./src/controllers/dbManagement');
const Backup = require('./src/controllers/backup');
const Restore = require('./src/controllers/restore');
const fastify = require('fastify')({ logger: true });

async function routes(fastify) {

  fastify.get('/', async (request, reply) => {
    return { message: 'Hello world' };
  });


  // affiche toutes les infos des bdd enregistrées dans db_info.
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


  // crée une bdd.
  fastify.post('/database-create', async (request, reply) => {
    const database = new dbManagement();
    try {
        const { user, host, name, port, type, password } = request.body;

        if (!user || !host || !name || !port || !type || !password) {
            return reply.status(400).send({ error: 'Missing required fields' });
        }

        const addDb = await database.createDb({ user, host, name, port, type, password });
        console.log(addDb);
        reply.send(addDb);
    } catch (err) {
        console.error('Error creating database', err);
        reply.status(500).send({ error: err.message });
    }
  });

  // affiche une bdd.
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


  // édite une bdd.
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

  // supprime une bdd.
  fastify.delete('/database/delete/:id', async (request, reply) => {
    const database = new dbManagement();
    const dbId = request.params.id;
    try {
      const result = await database.deleteDatabase(dbId);
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

  // affiche tous les backups enregistrés dans la table bakcup.
  fastify.get('/backups', async (request, reply) => {
    const backup = new Backup();
    
    try {
        const backups = await backup.showBackups();
        reply.code(200).send(backups);
    } catch (error) {
        console.error('Erreur lors de la récupération des backups:', error);
        reply.code(500).send({ error: 'Erreur lors de la récupération des backups.' });
    }
  });

  // exécute un dump d'une bdd.
  fastify.post('/backup/:id', async (request, reply) => {  
    const backup = new Backup();
    const { id } = request.params;  
    
    try {
        await backup.runBackup(id);
        
        reply.code(200).send({ message: 'Backup lancé avec succès.' });
    } catch (error) {
        console.error('Erreur lors du backup:', error);
        reply.code(500).send({ error: 'Échec lors du backup.' });
    }
  });

  // exécute le restore sur une bdd.
  fastify.post('/restore/:id', async (request, reply) => {
    const { id } = request.params;
    const { destinationDbId } = request.body;

    const restore = new Restore();

    try {
        await restore.runRestore(id, destinationDbId);
        reply.code(200).send({ message: 'Restauration lancée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la restauration:', error.message);
        reply.code(500).send({ error: 'Échec lors de la restauration.' });
    }
  });

  // affiche tous les restore enregistrés dans la table restore.
  fastify.get('/restores', async (request, reply) => {
    const restore = new Restore();
    
    try {
        const restores = await restore.showRestores();
        reply.code(200).send(restores);
    } catch (error) {
        console.error('Erreur lors de la récupération des restores:', error);
        reply.code(500).send({ error: 'Erreur lors de la récupération des restores.' });
    }
  });
}

module.exports = routes;