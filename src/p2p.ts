import WebSocket, { Server } from 'ws';
import { Blockchain } from './blockchain';
import { Block } from './types';

const P2P_PORT = Number(process.env.P2P_PORT) || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];


export class P2PService {
    private blockchain: Blockchain;
    private sockets: WebSocket[] = [];

    constructor(blockchain: Blockchain) {
        this.blockchain = blockchain;
    }

    messageHandler(socket: WebSocket): void {
        socket.on('message', (message: string) => {
            const data = JSON.parse(message);

            if (data.length) {
                this.blockchain.replaceChain(data);
            } else {
                this.blockchain.addBlock(data);
            }
        });
    }

    sendChain(socket: WebSocket) {
        socket.send(JSON.stringify(this.blockchain.getChain));
    }

    connectSocket(socket: WebSocket): void {
        this.sockets.push(socket);
        console.log('Socket connected');

        this.messageHandler(socket);
        this.sendChain(socket);
    }

    listen(): void {
        const server = new Server({ port: Number(P2P_PORT)});
        server.on('connection', (socket: WebSocket) => this.connectSocket(socket));

        this.connectToPeers();

        console.log(`P2P Server running on port ${P2P_PORT}`);
    }

    connectToPeers(): void {
        peers.forEach(async peer => {
            const socket = new WebSocket(peer);

            socket.on('open', () => this.connectSocket(socket));
        });
    }

    broadcastNewBlock(block: Block): void {
        this.sockets.forEach(socket => {
            socket.send(JSON.stringify(block));
        });
    }
}
