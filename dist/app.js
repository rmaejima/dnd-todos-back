"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const path_1 = require("path");
const fastify_autoload_1 = __importDefault(require("fastify-autoload"));
const fastify_cors_1 = __importDefault(require("fastify-cors"));
const app = async (fastify, opts) => {
    void fastify.register(fastify_autoload_1.default, {
        dir: (0, path_1.join)(__dirname, "plugins"),
        options: opts,
    });
    void fastify.register(fastify_autoload_1.default, {
        dir: (0, path_1.join)(__dirname, "routes"),
        routeParams: true,
        options: opts,
    });
    void fastify.register(fastify_cors_1.default, {
        origin: "*",
    });
};
exports.app = app;
exports.default = app;
//# sourceMappingURL=app.js.map