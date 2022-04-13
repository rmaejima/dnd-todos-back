"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const fastify_sensible_1 = __importDefault(require("fastify-sensible"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.register(fastify_sensible_1.default, {
        errorHandler: false,
    });
});
//# sourceMappingURL=sensible.js.map