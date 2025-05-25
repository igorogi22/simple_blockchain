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
