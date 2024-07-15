export const COMMON_SWAGGER_RESPONSES = {
    healthCheckResponse: {
        "message": "ok"
    },
    apiBadRequestResponse: {
        "message": "Something went wrong",
        "error": "server error",
        "statusCode": 400
    },
    forbiddenResponse: {
        "message": "Unauthorized",
        "statusCode": 401
    }
}