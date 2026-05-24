# Godot Simple Multiplayer Server

Professional Node.js WebSocket backend for multiplayer session handling in Godot projects.
Designed for fast local testing, mobile-first workflows, and public distribution alongside a Godot multiplayer plugin.

## Features

- WebSocket real-time communication
- Mobile-first support
- Termux compatibility
- Desktop compatibility
- Session handling
- Room system
- UUID client identification
- Fast setup
- Lightweight architecture
- Production deploy ready

## Requirements

- Node.js minimum version: 18.x recommended
- npm
- Android with Termux (optional)
- PC support on Windows, Linux, and macOS

## Installing Termux on Android

Install Termux from Google Play Store:

[Termux on Google Play](https://play.google.com/store/apps/details?id=com.termux)

Or use the official release channel:

[Termux GitHub Releases](https://github.com/termux/termux-app/releases)

GitHub release is recommended for the latest updates and package availability.

## Termux Setup

Update the package list first:

```bash
pkg update && pkg upgrade
```

Install Node.js:

```bash
pkg install nodejs
```

Verify the installation:

```bash
node -v
npm -v
```

## Cloning the Repository

Before installing dependencies, clone the project repository.

### On Android with Termux

If Git is not installed yet:

```bash
pkg install git
```

Clone the repository:

```bash
git clone [REPOSITORY_URL]
cd [PROJECT_FOLDER]
```

### On Desktop

Clone the repository:

```bash
git clone [REPOSITORY_URL]
cd [PROJECT_FOLDER]
```

### Manual alternative

- Download ZIP from GitHub
- Extract the files
- Open the project folder

After cloning or extracting, continue with dependency installation.

## Installing Dependencies

Install the backend dependencies:

```bash
npm install express ws uuid
```

Dependency overview:

- express → HTTP support
- ws → WebSocket server
- uuid → unique session/client IDs

Important note:

- The current server runtime path is WebSocket-first and depends on `ws`.
- `express` and `uuid` are included because they are common backend companions for public multiplayer stacks and future HTTP or identifier extensions.
- If your cloned project already contains a `package.json`, keep using the repository-defined dependency set.

## Project Setup

Create a working folder if you are starting from scratch:

```bash
mkdir multiplayer-server
cd multiplayer-server
```

Initialize the Node.js project if needed:

```bash
npm init -y
```

Expected project structure:

```plaintext
server/
 ├── server.js
 ├── package.json
 ├── node_modules/
```

If you cloned the repository, place the source files inside the project folder and keep the structure aligned with the server entry file.

## Running the Server

Start the backend:

```bash
node server.js
```

Expected startup output:

```plaintext
Servidor WebSocket rodando na porta 9090. Aguardando jogadores...
```

In this repository, the default port is `9090` unless you change it in `server.js`.

## Finding Your Local IP (Android)

Find your device IP address on Wi-Fi:

```bash
ifconfig
```

Look for the `inet xxx.xxx.xxx.xxx` line.

Example:

```plaintext
192.168.0.105
```

The Godot client connects using:

```plaintext
ws://192.168.0.105:PORT
```

Important:

- The client device must be on the same network.
- `localhost` only works on the same device running the server.

## Desktop Usage

Windows, Linux, and macOS are supported.

Install Node.js from the official website:

[Node.js Official Website](https://nodejs.org?utm_source=chatgpt.com)

Then install the dependencies and run the server:

```bash
npm install
node server.js
```

## Hosting Online

This server can be deployed online on:

- Render
- Railway
- VPS
- Docker
- Any host that supports Node.js

When deployed behind TLS, the client should connect using:

```plaintext
wss://your-server-url
```

For production, prefer a reverse proxy with HTTPS/TLS enabled.

## Connection Flow

1. Client connects
2. UUID assigned
3. Session created
4. Room join
5. State sync
6. Broadcast updates
7. Disconnect cleanup

## Common Commands

Install dependencies:

```bash
npm install
```

Run the server:

```bash
node server.js
```

Hot reload option:

```bash
npm install -g nodemon
nodemon server.js
```

## Troubleshooting

### "Command not found"

Install Node.js again and verify that `node` and `npm` are available in the terminal.

### "Cannot find module ws"

Install dependencies again:

```bash
npm install
```

### "Port already in use"

Change the server port in `server.js` and restart the process.

### Android cannot connect

Check the following:

- Both devices are on the same Wi-Fi network
- The local IP is correct
- Firewall rules are not blocking the port
- The Godot plugin has internet permission enabled

### Connection timeout

The server may be offline, unreachable, or the port may be blocked by the network or device firewall.

## Performance Recommendations

- Keep packet sizes small
- Avoid excessive broadcasts
- Limit tick rate
- Use interpolation client-side
- Reduce JSON overhead when possible

## Security Notes

- Validate messages
- Sanitize inputs
- Never trust client authority blindly
- Use rate limiting in production

## Development Tips

Termux is ideal for quick mobile testing on Android.

Recommended workflow:

- Edit in Godot
- Run the backend in Termux
- Test the local APK
- Deploy after validation

This is the recommended mobile-first workflow for fast iteration before moving to a public host.

## License

Placeholder

## Contribution

Placeholder

## Support

Placeholder

---

# Servidor Simple Multijogador Godot

Backend profissional em Node.js com WebSocket para gerenciamento de sessões multiplayer em projetos Godot.
Projetado para testes locais rápidos, fluxo mobile-first e distribuição pública junto de um plugin multiplayer para Godot.

## Features

- Comunicação em tempo real via WebSocket
- Suporte mobile-first
- Compatibilidade com Termux
- Compatibilidade com desktop
- Gerenciamento de sessões
- Sistema de salas
- Identificação de clientes por UUID
- Configuração rápida
- Arquitetura leve
- Pronto para deploy em produção

## Requirements

- Versão mínima recomendada do Node.js: 18.x
- npm
- Android com Termux (opcional)
- Suporte para PC em Windows, Linux e macOS

## Installing Termux on Android

Instale o Termux pela Google Play Store:

[Termux on Google Play](https://play.google.com/store/apps/details?id=com.termux)

Ou use o canal oficial de releases:

[Termux GitHub Releases](https://github.com/termux/termux-app/releases)

Recomendação: o GitHub release é preferível para receber atualizações mais recentes e melhor disponibilidade de pacotes.

## Termux Setup

Atualize a lista de pacotes primeiro:

```bash
pkg update && pkg upgrade
```

Instale o Node.js:

```bash
pkg install nodejs
```

Verifique a instalação:

```bash
node -v
npm -v
```

## Cloning the Repository

Antes de instalar dependências, clone o repositório do projeto.

### No Android com Termux

Se o Git ainda não estiver instalado:

```bash
pkg install git
```

Clone o repositório:

```bash
git clone [REPOSITORY_URL]
cd [PROJECT_FOLDER]
```

### No desktop

Clone o repositório:

```bash
git clone [REPOSITORY_URL]
cd [PROJECT_FOLDER]
```

### Alternativa manual

- Baixe o ZIP do GitHub
- Extraia os arquivos
- Abra a pasta do projeto

Depois de clonar ou extrair, continue com a instalação das dependências.

## Installing Dependencies

Instale as dependências do backend:

```bash
npm install express ws uuid
```

Visão geral das dependências:

- express → suporte HTTP
- ws → servidor WebSocket
- uuid → IDs únicos de sessão / cliente

Observação importante:

- O fluxo atual do servidor é centrado em WebSocket e depende de `ws`.
- `express` e `uuid` foram incluídos porque são companheiros comuns em stacks públicas de multiplayer e extensões futuras de HTTP ou identificação.
- Se o repositório clonado já incluir `package.json`, mantenha o conjunto de dependências definido pelo projeto.

## Project Setup

Crie uma pasta de trabalho se você estiver começando do zero:

```bash
mkdir multiplayer-server
cd multiplayer-server
```

Inicialize o projeto Node.js se necessário:

```bash
npm init -y
```

Estrutura esperada do projeto:

```plaintext
server/
 ├── server.js
 ├── package.json
 ├── node_modules/
```

Se você clonou o repositório, coloque os arquivos-fonte dentro da pasta do projeto e mantenha a estrutura alinhada com o arquivo de entrada do servidor.

## Running the Server

Inicie o backend:

```bash
node server.js
```

Saída esperada na inicialização:

```plaintext
Servidor WebSocket rodando na porta 9090. Aguardando jogadores...
```

Neste repositório, a porta padrão é `9090`, a menos que você a altere em `server.js`.

## Finding Your Local IP (Android)

Encontre o endereço IP do dispositivo na rede Wi-Fi:

```bash
ip addr show wlan0
```

Procure pela linha `inet xxx.xxx.xxx.xxx`.

Exemplo:

```plaintext
192.168.0.105
```

O cliente Godot conecta usando:

```plaintext
ws://192.168.0.105:PORT
```

Importante:

- O dispositivo cliente precisa estar na mesma rede.
- `localhost` só funciona no mesmo dispositivo que está rodando o servidor.

## Desktop Usage

Windows, Linux e macOS são suportados.

Instale o Node.js no site oficial:

[Node.js Official Website](https://nodejs.org)

Depois instale as dependências e execute o servidor:

```bash
npm install
node server.js
```

## Hosting Online

Este servidor pode ser hospedado online em:

- Render
- Railway
- VPS
- Docker
- Qualquer host com suporte a Node.js

Quando estiver atrás de TLS, o cliente deve conectar usando:

```plaintext
wss://your-server-url
```

Em produção, prefira um reverse proxy com HTTPS/TLS habilitado.

## Connection Flow

1. O cliente conecta
2. O UUID é atribuído
3. A sessão é criada
4. O cliente entra em uma sala
5. O estado é sincronizado
6. As atualizações são transmitidas por broadcast
7. A limpeza ocorre na desconexão

## Common Commands

Instalar dependências:

```bash
npm install
```

Executar o servidor:

```bash
node server.js
```

Hot reload opcional:

```bash
npm install -g nodemon
nodemon server.js
```

## Troubleshooting

### "Command not found"

Instale o Node.js novamente e verifique se `node` e `npm` estão disponíveis no terminal.

### "Cannot find module ws"

Instale as dependências novamente:

```bash
npm install
```

### "Port already in use"

Altere a porta do servidor em `server.js` e reinicie o processo.

### Android cannot connect

Verifique os seguintes pontos:

- Ambos os dispositivos estão na mesma rede Wi-Fi
- O IP local está correto
- As regras de firewall não estão bloqueando a porta
- O plugin Godot está com permissão de internet habilitada

### Connection timeout

O servidor pode estar offline, inacessível ou a porta pode estar bloqueada pela rede ou pelo firewall do dispositivo.

## Performance Recommendations

- Mantenha os pacotes pequenos
- Evite broadcasts excessivos
- Limite a taxa de atualização
- Use interpolação no cliente
- Reduza o overhead de JSON quando possível

## Security Notes

- Valide mensagens
- Sanitize inputs
- Nunca confie cegamente na autoridade do cliente
- Use rate limiting em produção

## Development Tips

O Termux é ideal para testes rápidos no Android.

Fluxo recomendado:

- Edite no Godot
- Rode o backend no Termux
- Teste o APK localmente
- Faça deploy após validação

Este é o fluxo mobile-first recomendado para iterar rapidamente antes de publicar em um host online.

## License

Placeholder

## Contribution

Placeholder

## Support

Placeholder
