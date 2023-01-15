import { resolve } from 'path';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { uniq } from 'lodash-es';
import { type PinoLoggerOptions } from 'fastify/types/logger.js';
import { type PrettyOptions } from 'pino-pretty';

export const RUNTIME_DIR = resolve(process.cwd(), '.run');

mkdirSync(RUNTIME_DIR, { recursive: true });

export const PID_FILE = resolve(RUNTIME_DIR, 'pid');

export const RUNTIME_FILE = resolve(RUNTIME_DIR, 'runtime');

export const CONFIG_DIRS = uniq([
    '/etc/wxs',
    resolve(process.cwd(), 'config'),
    fileURLToPath(new URL('../../config', import.meta.url)),
]);

export const AVAILABLE_CONFIG_FILES = [
    'config.yaml',
    'config.yml',
];

// logger config for global use, use fastify logger first
export const LOGGER_CONFIG: PinoLoggerOptions = process.env.NODE_ENV === 'production' ? {} : {
    transport: {
        target: 'pino-pretty',
        options: {
            destination: 1,
            translateTime: true,
            ignore: 'pid,hostname',
        } as PrettyOptions,
    },
};
