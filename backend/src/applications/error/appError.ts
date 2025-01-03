export class AppError extends Error {
    public readonly statusCode: number

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        this.name = 'AppError'
    }

    static badRequest(message: string) {
        return new AppError(message, 400)
    }

    static notFound(message: string) {
        return new AppError(message, 404)
    }

    static notAcceptable(message: string) {
        return new AppError(message, 406)
    }

    static internalServerError(message: string) {
        return new AppError(message, 500);
    }
}