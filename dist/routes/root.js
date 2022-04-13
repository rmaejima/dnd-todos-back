"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const root = async (fastify) => {
    fastify.get("/", async (_, reply) => {
        reply.send("Hello world!");
    });
};
exports.default = root;
//# sourceMappingURL=root.js.map