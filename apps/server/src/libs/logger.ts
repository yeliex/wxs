import { LOGGER_CONFIG } from './const.js';
import { type FastifyBaseLogger } from 'fastify';
// @ts-ignore
import { createLogger } from 'fastify/lib/logger.js';

// Logger for before fastify init
export const {
    logger,
    hasLogger,
} = createLogger({ logger: LOGGER_CONFIG }) as { logger: FastifyBaseLogger, hasLogger: boolean };
