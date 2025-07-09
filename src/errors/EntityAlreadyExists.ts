export class EntityAlreadyExists extends Error {
    constructor(message: string) {
        super(message);
    }
}