const successResponse = (res, message, data, status = 200) => {
    return res.status(status).json({
        status: 'success',
        message,
        data
    })
}

const unauthorizedResponse = (res, message) => {
    return res.status(401).json({
        status: 'unauthorized',
        message
    })
}

const forbiddenResponse = (res, message) => {
    return res.status(403).json({
        status: 'forbidden',
        message
    })
}

const badRequestResponse = (res, error) => {
    return res.status(400).json({
        status: 'bad request',
        error
    })
}

const serverErrorResponse = (res, error) => {
    return res.status(503).json({
        status: 'server error',
        error
    })
}

const validationErrorResponse = (res, message) => {
    return res.status(400).json({
        status: 'validation error',
        message
    })
}

module.exports = {
    successResponse,
    unauthorizedResponse,
    forbiddenResponse,
    badRequestResponse,
    serverErrorResponse,
    validationErrorResponse
}
