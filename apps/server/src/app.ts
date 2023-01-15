import { fastify } from 'fastify';
import * as process from 'process';
import { createWriteStream } from 'fs';
import { writeFile } from 'fs/promises';
import { LOGGER_CONFIG, PID_FILE, RUNTIME_FILE } from './libs/const.js';
import RouterRegisterPlugin from './plugins/router/index.js';
import SerializeResponsePlugin from './plugins/response/index.js';
import { fastifyRedis } from '@fastify/redis';
import config from './libs/config.js';
import MysqlPlugin from './plugins/mysql/index.js';

const app = fastify({
    logger: LOGGER_CONFIG,
    requestIdHeader: 'x-request-id',
});

app.register(SerializeResponsePlugin);
app.register(RouterRegisterPlugin);
app.register(fastifyRedis, {
    ...config.redis,
    closeClient: true,
});
app.register(MysqlPlugin);

app.addHook('onReady', async () => {
    const stream = createWriteStream(RUNTIME_FILE, { flags: 'w' });

    stream.write('======PLUGINS======\r');
    stream.write(app.printPlugins());
    stream.write('\r======ROUTERS======\r');
    stream.write(app.printRoutes({ includeHooks: true, includeMeta: true, commonPrefix: false }));

    stream.end();

    await writeFile(PID_FILE, `${process.pid}`);
});

export default app;
