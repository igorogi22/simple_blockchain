import { Blockchain } from "./blockchain";
import { P2PService } from './p2p';

const difficulty = Number(process.argv[2]) || 4;

const blockchain = new Blockchain(difficulty);

const p2pServer = new P2PService(blockchain); // to add a new node P2P_PORT=5002 PEERS=ws://localhost:5001 npx ts-node src/index.ts

p2pServer.listen();

(() => {
    setInterval(() => {
        const blockIndex = blockchain.getChain.length;
        console.log({ blockIndex, chain: blockchain.getChain });

        const block = blockchain.createBlock(`Block #${blockIndex}`);

        const mineBlock = blockchain.mineBlock(block);
        p2pServer.broadcastNewBlock(mineBlock);
        blockchain.addBlock(mineBlock);
    }, 10000);
})();
