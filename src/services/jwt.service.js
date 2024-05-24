import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


const genneralAccessToken = async (payload) => {
    const accessToken = jwt.sign({
        payload
    }, process.env.ACCESS_TOKEN, {expiresIn: '1h'})
    return accessToken
}

const refeshAccessToken = async (payload) => {
    const accessToken = jwt.sign({
        payload
    }, process.env.REFRESH_TOKEN, {expiresIn: '365d'})
    return accessToken
}

export {genneralAccessToken, refeshAccessToken}