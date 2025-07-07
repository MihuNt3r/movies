export class NotFoundError extends Error {
    constructor(entity: string) {
        const message = `${entity} is not found`;
        super(message);
    }
}