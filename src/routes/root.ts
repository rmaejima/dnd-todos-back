import { FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify) => {
  fastify.get('/', async (_, reply) => {
    reply.send('Hello world!');
  });
};

export default root;
