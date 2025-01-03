import { ErrorRequestHandler } from "express"
import { AppError } from "../../../applications/error/appError"

const ERROR_CODES: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    500: "INTERNAL_SERVER_ERROR",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const errorCode = ERROR_CODES[err.statusCode] || "UNKNOWN_ERROR";
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error_code: errorCode,
            error_description: err.message
        })
    } else {
        res.status(500).json({
            error_code: errorCode,
            error_description: 'Internal Server Error'
        })
    }
}
