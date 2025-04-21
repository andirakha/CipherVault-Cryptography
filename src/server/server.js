const Hapi = require('@hapi/hapi');
const routes = require('./route');

const init = async () => {
    const server = Hapi.Server({
        port: 8080,
        host: process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0",
        routes: {
            cors: {
                origin: ["*"]
            },
            payload: {
                maxBytes: 10485760, // 10MB limit
            }
        },
    });

    server.route(routes);

    server.ext("onPreResponse", (request, h) => {
        const response = request.response;
        if (response.isBoom) {
            return h.response({
                status: "fail",
                message: response.message
            }).code(response.output.statusCode);
        }

        return h.continue;
    });

    await server.start();

    console.log(`listening on ${server.info.uri}`);
}

init();