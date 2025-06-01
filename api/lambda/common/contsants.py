class StatusCodes:
    OK = 200
    CREATED = 201
    BAD_REQUEST = 400
    NOT_FOUND = 404
    INTERNAL_SERVER_ERROR = 500
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    METHOD_NOT_ALLOWED = 405


class Headers:
    CORS = {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Content-Type": "application/json",
        "Access-Control-Max-Age": "86400",
        "Vary": "Origin, Access-Control-Request-Method, Access-Control-Request-Headers",
        "Cache-Control": "max-age=86400, public",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "no-referrer",
    }
