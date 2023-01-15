import { defaultsDeep } from 'lodash-es';
import { CONFIG_DIRS, AVAILABLE_CONFIG_FILES } from './const.js';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import * as util from 'util';
import { logger, hasLogger } from './logger.js';
import { type RedisOptions } from 'ioredis';
import * as process from 'process';

export interface ConfigType {
    server: {
        port: number;
        host: string;
    };
    redis: Partial<RedisOptions> & {
        url?: string;
    };
    db: {
        url: string;
    };
}

const DEFAULT_CONFIG: ConfigType = {
    server: {
        port: 3000,
        host: '0.0.0.0',
    },
    redis: {
        url: 'redis://localhost:6379',
    },
    db: {
        url: process.env.DATABASE_URL || 'mysql://root@localhost:3306/wxs',
    },
};

const getConfig = (path: string): Partial<ConfigType> => {
    const content = readFileSync(path, 'utf-8');

    return parse(content);
};

const getConfigFromDIR = (dir: string) => {
    for (const file of AVAILABLE_CONFIG_FILES) {
        const path = resolve(dir, file);

        hasLogger && logger.debug(`try to load config from ${path}`);

        try {
            const content = getConfig(path);

            hasLogger && logger.info(`config loaded from ${path}`);

            return content;
        } catch (e: any) {
            hasLogger && logger.debug(`failed to load config from ${path}: ${e.message}`);

            if (e.code !== 'ENOENT') {
                throw e;
            }
        }
    }

    return {};
};

const getConfigs = (): ConfigType => {
    const config = Object.freeze(defaultsDeep(
        ...CONFIG_DIRS.map(getConfigFromDIR) as [],
        DEFAULT_CONFIG,
    ));

    hasLogger && logger.info(`config loaded: ${util.inspect(config)}`);

    return config;
};

export class Config implements Readonly<ConfigType> {
    readonly #options: ConfigType = getConfigs();

    get server() {
        return this.#options.server;
    }

    get redis() {
        return this.#options.redis;
    }

    get db() {
        return this.#options.db;
    }

    toString() {
        return JSON.stringify(this.#options, null, 2);
    }

    [util.inspect.custom]() {
        return `Config ${util.inspect(this.#options)}`;
    }
}

const config = new Config();

export default config;
