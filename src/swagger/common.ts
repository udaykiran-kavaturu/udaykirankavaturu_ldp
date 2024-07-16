export const COMMON_SWAGGER_RESPONSES = {
  healthCheckResponse: {
    message: 'ok',
  },
  apiBadRequestResponse: {
    "statusCode": 400,
    "message": "server error message",
    "timestamp": "2024-07-16T11:25:06.409Z",
    "path": "/users?id=60"
  },
  forbiddenResponse: {
    message: 'Unauthorized',
    statusCode: 401,
  },
};
