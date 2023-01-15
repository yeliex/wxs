import { type FastifyPluginAsync } from 'fastify';
import { readdir } from 'fs/promises';
import { resolve, extname } from 'path';
import { fileURLToPath, URL } from 'url';

const BASE = fileURLToPath(new URL('../../routes', import.meta.url));

const AVAILABLE_EXT = extname(import.meta.url) === '.ts' ? ['.ts'] : ['.js'];

const RouterLoaderPlugin: FastifyPluginAsync = async (fastify) => {
    const files = await readdir(BASE);

    for (const file of files) {
        const ext = extname(file);

        if (!AVAILABLE_EXT.includes(ext)) {
            return;
        }

        const route = await import(resolve(BASE, file));

        fastify.register(route.default, {
            prefix: route.prefix,
        });
    }
};

export default RouterLoaderPlugin;
