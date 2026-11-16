const PORT = process.env.PORT || 9090;

const wss = new WebSocket.Server({
    host: "0.0.0.0",
    port: PORT
});

console.log(`Servidor WebSocket rodando na porta ${PORT}`);
