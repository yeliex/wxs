import { FastifyPluginAsync } from 'fastify';
import plugin from 'fastify-plugin';

const SerializeResponsePlugin: FastifyPluginAsync = async (instance) => {
    instance.setReplySerializer((payload, statusCode) => {
        if (typeof payload === 'string' || payload instanceof Buffer) {
            return payload as string;
        }

        if (statusCode !== 200) {
            return JSON.stringify(payload);
        }

        return JSON.stringify({
            code: statusCode,
            data: payload,
        });
    });

    instance.setNotFoundHandler((_, reply) => {
        reply.statusCode = 404;
        reply.send({
            code: 404,
            message: 'not found',
            error: 'NotFound',
        });
    });

    instance.setErrorHandler((error, _, reply) => {
        let code = error.statusCode;
        let subcode = 0;

        if (!code && typeof error.code === 'number') {
            if (error.code < 400 || error.code >= 600) {
                code = 500;
                subcode = error.code;
            } else {
                code = error.code;
            }
        }

        if (!code) {
            code = 500;
        }

        reply.statusCode = code;
        return {
            code,
            subcode,
            error: error.name,
            message: error.message,
            stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
        };
    });
}

export default plugin(SerializeResponsePlugin);
