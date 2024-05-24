import jwt from 'jsonwebtoken'

const genneralAccessToken = async (payload) => {
    const accessToken = jwt.sign({
        payload
    }, 'access_token', {expiresIn: '1h'})
    return accessToken
}

const refeshAccessToken = async (payload) => {
    const accessToken = jwt.sign({
        payload
    }, 'refesh_token', {expiresIn: '365d'})
    return accessToken
}

export {genneralAccessToken, refeshAccessToken}