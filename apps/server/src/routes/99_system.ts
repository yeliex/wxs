import { FastifyPluginAsync } from 'fastify';

const SystemModule: FastifyPluginAsync = async (fastify) => {
    fastify.get('/system', async () => {
        return {
            version: fastify.version,
        };
    });

    fastify.get('/print', async (_, reply) => {
        reply.send(`
        ======PLUGINS======
        ${fastify.printPlugins()}

        ======ROUTERS======
        ${fastify.printRoutes({ includeHooks: true, includeMeta: true })}
        `);
    });

    fastify.get('/exception', () => {
        throw new Error('asd');
    });

    fastify.get('/not_found', (_, reply) => {
        reply.callNotFound();
    });

    fastify.get('/bad_request', () => {
        const error = new Error('bad request') as any;
        error.code = 400;
        throw error;
    });

    fastify.get('/buffer', () => {
        return Buffer.from('123');
    });

    fastify.get('/empty', async (_, reply) => {
        reply.send(undefined);
    });

    fastify.get('/test', async () => {
        return 'string';
    });

    fastify.get('/number', async () => {
        return 12312;
    });

    fastify.get('/boolean', async () => {
        return false;
    });
};

export const prefix = '/_';

export default SystemModule;
