const WebSocket = require('ws');
const crypto = require('crypto');

const wss = new WebSocket.Server({ host: "0.0.0.0", port: 9090 });

console.log("Servidor WebSocket rodando na porta 9090. Aguardando jogadores...");

let salas = {}; 

wss.on('connection', (ws) => {
    ws.uuid = crypto.randomUUID();
    ws.room = null;

    ws.send(JSON.stringify({ cmd: "joined_server", content: { uuid: ws.uuid } }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const cmd = data.cmd;
        const content = data.content;

        switch (cmd) {
            case "create_room":
                const codigo = Math.random().toString(36).substring(2, 7).toUpperCase();
                const limite = content.max_players || 10; 

                salas[codigo] = {
                    jogadores: {},
                    host: ws.uuid,
                    limite_jogadores: limite,
                    started: false // <--- NOVO: A sala nasce destrancada
                };

                ws.room = codigo;
                salas[codigo].jogadores[ws.uuid] = ws;

                console.log(`[+] Sala ${codigo} criada por ${ws.uuid}. (Máx: ${limite})`);

                ws.send(JSON.stringify({
                    cmd: "room_created",
                    content: { code: codigo, is_host: true }
                }));

                ws.send(JSON.stringify({ 
                    cmd: "spawn_local_player", 
                    content: { player: { uuid: ws.uuid, x: 0, y: 5, z: 0 } } 
                }));
                break;

            case "join_room":
                const salaCode = content.code.toUpperCase();

                if (!salas[salaCode]) {
                    ws.send(JSON.stringify({ cmd: "error", content: { msg: "Sala não encontrada!" } }));
                    return;
                }

                const sala = salas[salaCode];

                // <--- NOVO: A partida já começou? Tranca a porta! --->
                if (sala.started) {
                    ws.send(JSON.stringify({ cmd: "error", content: { msg: "A partida já começou!" } }));
                    return;
                }

                const numJogadores = Object.keys(sala.jogadores).length;

                if (numJogadores >= sala.limite_jogadores) {
                    ws.send(JSON.stringify({ cmd: "error", content: { msg: "A sala está cheia!" } }));
                    return;
                }

                ws.room = salaCode;
                sala.jogadores[ws.uuid] = ws;

                console.log(`[>] Jogador ${ws.uuid} entrou na sala ${salaCode}`);

                ws.send(JSON.stringify({
                    cmd: "room_joined",
                    content: { code: salaCode, is_host: false }
                }));

                broadcast(salaCode, { 
                    cmd: "spawn_new_player", 
                    content: { player: { uuid: ws.uuid, x: 0, y: 5, z: 0 } } 
                }, ws.uuid);

                const listaVeteranos = [];
                for (const id in sala.jogadores) {
                    if (id !== ws.uuid) {
                        listaVeteranos.push({ uuid: id, x: 0, y: 5, z: 0 }); 
                    }
                }
                ws.send(JSON.stringify({ 
                    cmd: "spawn_network_players", 
                    content: { players: listaVeteranos } 
                }));

                ws.send(JSON.stringify({ 
                    cmd: "spawn_local_player", 
                    content: { player: { uuid: ws.uuid, x: 0, y: 5, z: 0 } } 
                }));
                break;

            case "start_game":
                if (ws.room && salas[ws.room]) {
                    if (salas[ws.room].host === ws.uuid) {
                        salas[ws.room].started = true; // <--- NOVO: Tranca a sala para novos jogadores!
                        console.log(`[!] Partida iniciada pelo Host na sala ${ws.room}`);
                        
                        broadcast(ws.room, { cmd: "start_game", content: {} });
                    }
                }
                break;

            case "position":
                if (ws.room && salas[ws.room]) {
                    broadcast(ws.room, {
                        cmd: "update_position",
                        content: {
                            uuid: ws.uuid,
                            x: content.x,
                            y: content.y,
                            z: content.z,
                            r_y: content.r_y
                        }
                    }, ws.uuid);
                }
                break;
        }
    });

    ws.on('close', () => {
        if (ws.room && salas[ws.room]) {
            console.log(`[<] Jogador ${ws.uuid} desconectou da sala ${ws.room}`);
            delete salas[ws.room].jogadores[ws.uuid];
            
            broadcast(ws.room, {
                cmd: "player_disconnected",
                content: { uuid: ws.uuid }
            });

            if (Object.keys(salas[ws.room].jogadores).length === 0) {
                delete salas[ws.room];
                console.log(`[-] Sala ${ws.room} encerrada e removida da memória.`);
            }
        }
    });
});

function broadcast(roomCode, messageObj, excludeUuid = null) {
    if (!salas[roomCode]) return;
    const msgString = JSON.stringify(messageObj);
    const jogadores = salas[roomCode].jogadores;
    for (const id in jogadores) {
        if (id !== excludeUuid) {
            jogadores[id].send(msgString);
        }
    }
}