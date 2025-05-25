import { createHash } from "node:crypto";

import { hash, isValidHash } from "./hepers";

export interface Block {
    header: {
        nounce: number;
        hash: string;
    },
    payload: {
        sequence: number;
        timestamp: number;
        data: any;
        previousHash: string;
    }
};

export class Blockchain {
    private powPrefix = "0";

    #chain: Block[] = [];

    constructor(private readonly difficulty: number = 4) {
        this.#chain.push(this.createGenesisBlock());
    }

    private createGenesisBlock(): Block {
        const payload: Block["payload"] = {
            sequence: 0,
            timestamp: Date.now(),
            data: "Genesis Block",
            previousHash: ""
        };

        return {
            header: {
                nounce: 0,
                hash: hash(JSON.stringify(payload)),
            },
            payload,
        };
    }

    get getChain(): Block[] {
        return this.#chain;
    }

    private get lastBlock(): Block {
        return this.#chain[this.#chain.length - 1] as Block;
    }

    private get lastBlockHash(): string {
        return this.lastBlock.header.hash;
    }

    createBlock(data: any): Block["payload"] {
        const newBlock: Block["payload"] = {
            sequence:  this.lastBlock.payload.sequence + 1,
            timestamp: Date.now(),
            data,
            previousHash: this.lastBlockHash,
        }

        console.log(`Block ${newBlock.sequence} created!\n`, JSON.stringify(newBlock));
        return newBlock;
    }

    mineBlock(blockPayload: Block["payload"]): Block {
        let nounce = 0;
        const start = Date.now();

        const payloadHash = hash(JSON.stringify(blockPayload));

        let powHash = "";

        while (true) {
            powHash = hash(payloadHash + nounce);

            if (isValidHash({ hash: powHash, difficulty: this.difficulty, prefix: this.powPrefix })) {
                const reducedHash = powHash.slice(0, 12);

                const end = Date.now();
                const time = (end - start) / 1000;

                console.log(`Block ${blockPayload.sequence} mined!\n Block mining took ${time} seconds\nHash ${reducedHash} (${nounce} attempts)`);

                return {
                    header: {
                        nounce,
                        hash: payloadHash,
                    },
                    payload: blockPayload,
                };
            }

            nounce++;
        }
    }

    verifyBlock(block: Block): boolean {
        if (block.payload.previousHash !== this.lastBlockHash) {
            console.log(`Block #${block.payload.sequence} invalid. Previous hash is invalid`);
            return false;
        }
        const hashTest = hash(hash(JSON.stringify(block.payload)) + block.header.nounce);
        if (!isValidHash({ hash: hashTest, difficulty: this.difficulty, prefix: this.powPrefix })) {
            console.log(`Block #${block.payload.sequence} invalid. Nounce can't verified.`)
            return false;
        }

        return true;
    }

    addBlock(block: Block): Block[] {
        if (this.verifyBlock(block)) {
            this.#chain.push(block);
            console.log(`Block #${block.payload.sequence} added to blockchain:\n${JSON.stringify(block, null, 2)}`)
        }

        return this.#chain;
    }
}
