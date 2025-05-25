import { Blockchain } from "./blockchain";

const difficulty = Number(process.argv[2]) || 4;
const blockchain = new Blockchain(difficulty);

const blocks = Number(process.argv[3]) || 10;
let chain = blockchain.getChain;

for (let i = 0; i < blocks; i++) {
    const block = blockchain.createBlock(`Bloco ${i + 1}`);
    const minedBlock = blockchain.mineBlock(block);
    chain = blockchain.addBlock(minedBlock);
}

console.log(`--- BLOCKCHAIN ---`);
console.log(chain);
console.log(`\n\n--- BLOCKCHAIN ---`);
