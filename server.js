const { WebSocketServer } = require("ws");

const PORT = process.env.PORT || 9090;

const wss = new WebSocketServer({
    host: "0.0.0.0",
    port: PORT
});

console.log(`Servidor WebSocket rodando na porta ${PORT}`);
