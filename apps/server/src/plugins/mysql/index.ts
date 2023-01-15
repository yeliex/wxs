import { PrismaClient } from '@prisma/client';
import { FastifyPluginAsync } from 'fastify';
import config from '../../libs/config.js';

const db = new PrismaClient({
    datasources: {
        db: config.db,
    },
});

declare module 'fastify' {
    interface FastifyInstance {
        db: typeof db;
    }
}

const MysqlPlugin: FastifyPluginAsync = async (fastify) => {
    if (fastify.db) {
        throw new Error('fastify.db has already been registered');
    }

    await db.$connect();

    fastify.addHook('onClose', async (instance) => {
        try {
            await instance.db.$disconnect();
        } catch (e) {
            instance.log.error('DB disconnect failed', e);
        }
    });

    fastify.decorate('db', db);
};

export default MysqlPlugin;
