import { FastifyPluginAsync } from 'fastify';

const AppModule: FastifyPluginAsync = async (fastify) => {
    fastify.get('/config', async function getConfig(_, reply) {

    });
};

export const prefix = '/api/app';

export default AppModule;
