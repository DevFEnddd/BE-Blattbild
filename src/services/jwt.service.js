import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


const genneralAccessToken = async (payload) => {
    const accessToken = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, {expiresIn: '1h'})
    return accessToken
}

const refeshAccessToken = async (payload) => {
    const refeshAccessToken = jwt.sign({
        payload
    }, process.env.REFRESH_TOKEN, {expiresIn: '365d'})
    return refeshAccessToken
}

const refeshToken = async (payload) => {
    return new Promise( (resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if(err) {
                    resolve({
                        status: 500,
                        message: "The authemtication"
                    })
                }
                const {payload} = user
                const access_token = await genneralAccessToken({
                id: payload?.id,
                isAdmin: payload?.isAdmin
            })
            resolve({
                status: 200,
                message: "refresh token success!"
            })
            })
            
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
    
}

export default {genneralAccessToken, refeshAccessToken, refeshToken}