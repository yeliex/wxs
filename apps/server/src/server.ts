if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

import config from './libs/config.js';
import app from './app.js';

app.listen({
    port: config.server.port,
    host: config.server.host,
});
