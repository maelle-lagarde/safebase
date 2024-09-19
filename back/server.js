const routes = require('./routes');
const fastify = require('fastify')({
  logger: true
});

fastify.register(require('@fastify/cors'), { 
  origin: true,
});

fastify.register(routes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();