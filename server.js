const WebSocket = require('ws');
const crypto = require('crypto'); // Módulo nativo do Node para gerar IDs únicos

// host: "0.0.0.0" garante que o celular possa conectar pela rede Wi-Fi!
const wss = new WebSocket.Server({ host: "0.0.0.0", port: 9090 });

console.log("Servidor WebSocket rodando na porta 9090. Aguardando jogadores...");

// Dicionário mestre que vai guardar todas as salas e quem está nelas
let salas = {}; 

wss.on('connection', (ws) => {
    // 1. O jogador entra e ganha uma "identidade" (UUID)
    ws.uuid = crypto.randomUUID();
    ws.room = null;

    ws.send(JSON.stringify({ cmd: "joined_server", content: { uuid: ws.uuid } }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        const cmd = data.cmd;
        const content = data.content;

        switch (cmd) {
            case "create_room":
                // Gera um código de 5 caracteres aleatórios (ex: J9B2X)
                const codigo = Math.random().toString(36).substring(2, 7).toUpperCase();
                
                // O Godot pode enviar o limite, se não enviar, o padrão é 10
                const limite = content.max_players || 10; 

                salas[codigo] = {
                    jogadores: {},
                    host: ws.uuid, // Quem clicou em "Criar" vira o Host
                    limite_jogadores: limite
                };

                ws.room = codigo;
                salas[codigo].jogadores[ws.uuid] = ws;

                console.log(`[+] Sala ${codigo} criada por ${ws.uuid}. (Máx: ${limite})`);

                // Avisa o criador que a sala tá pronta e confirma que ele é o Host
                ws.send(JSON.stringify({
                    cmd: "room_created",
                    content: { code: codigo, is_host: true }
                }));

                // Manda o criador "nascer" na Ilha de Espera
                ws.send(JSON.stringify({ 
                    cmd: "spawn_local_player", 
                    content: { player: { uuid: ws.uuid, x: 0, y: 5, z: 0 } } 
                }));
                break;

            case "join_room":
                const salaCode = content.code.toUpperCase();

                // Regra 1: A sala existe?
                if (!salas[salaCode]) {
                    ws.send(JSON.stringify({ cmd: "error", content: { msg: "Sala não encontrada!" } }));
                    return;
                }

                const sala = salas[salaCode];
                const numJogadores = Object.keys(sala.jogadores).length;

                // Regra 2: A sala tem vaga?
                if (numJogadores >= sala.limite_jogadores) {
                    ws.send(JSON.stringify({ cmd: "error", content: { msg: "A sala está cheia!" } }));
                    return;
                }

                ws.room = salaCode;
                sala.jogadores[ws.uuid] = ws;

                console.log(`[>] Jogador ${ws.uuid} entrou na sala ${salaCode}`);

                // Confirma pro jogador que ele entrou na sala (não é Host)
                ws.send(JSON.stringify({
                    cmd: "room_joined",
                    content: { code: salaCode, is_host: false }
                }));

                // --- A MÁGICA DO SPAWN NA ILHA ---
                // 1. Avisa a galera que já estava na sala para spawnar o novato
                broadcast(salaCode, { 
                    cmd: "spawn_new_player", 
                    content: { player: { uuid: ws.uuid, x: 0, y: 5, z: 0 } } 
                }, ws.uuid);

                // 2. Faz uma lista dos veteranos e manda pro novato spawnar eles
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

                // 3. Por fim, avisa o novato para spawnar seu próprio boneco local
                ws.send(JSON.stringify({ 
                    cmd: "spawn_local_player", 
                    content: { player: { uuid: ws.uuid, x: 0, y: 5, z: 0 } } 
                }));
                break;

            case "start_game":
                // Regra Mestre: Só o dono da sala (Host) tem o poder de apertar Start
                if (ws.room && salas[ws.room]) {
                    if (salas[ws.room].host === ws.uuid) {
                        console.log(`[!] Partida iniciada pelo Host na sala ${ws.room}`);
                        
                        // Avisa TODO MUNDO para pular da Ilha de Espera para a Arena (mundo_teste)
                        broadcast(ws.room, { cmd: "start_game", content: {} });
                    }
                }
                break;

            case "position":
                // Pega o X, Y, Z e a rotação e repassa como um espelho para os outros
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
        // Rotina de limpeza: O cara fechou o jogo ou caiu a internet
        if (ws.room && salas[ws.room]) {
            console.log(`[<] Jogador ${ws.uuid} desconectou da sala ${ws.room}`);
            delete salas[ws.room].jogadores[ws.uuid];
            
            // Avisa os sobreviventes para deletarem o fantasma dele
            broadcast(ws.room, {
                cmd: "player_disconnected",
                content: { uuid: ws.uuid }
            });

            // Se a sala ficar vazia (todo mundo quitou), o servidor apaga ela para não explodir a memória RAM
            if (Object.keys(salas[ws.room].jogadores).length === 0) {
                delete salas[ws.room];
                console.log(`[-] Sala ${ws.room} encerrada e removida da memória.`);
            }
        }
    });
});

// Função rápida para o servidor "gritar" uma mensagem para todos da mesma sala
function broadcast(roomCode, messageObj, excludeUuid = null) {
    if (!salas[roomCode]) return;

    const msgString = JSON.stringify(messageObj);
    const jogadores = salas[roomCode].jogadores;

    for (const id in jogadores) {
        // Se houver um excludeUuid (ex: quem enviou a posição), não mandamos o pacote de volta pra ele
        if (id !== excludeUuid) {
            jogadores[id].send(msgString);
        }
    }
}