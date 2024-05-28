import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


const genneralAccessToken = async (payload) => {
    const accessToken = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, {expiresIn: '1h'})
    return accessToken
}

const genneralRefeshToken = async (payload) => {
    const refeshAccessToken = jwt.sign({
        payload
    }, process.env.REFRESH_TOKEN, {expiresIn: '365d'})
    return refeshAccessToken
}

const refeshToken = async (token) => {
    return new Promise( (resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if(err) {
                    resolve({
                        status: 500,
                        message: "The authemtication"
                    })
                }
                const access_token = await genneralAccessToken({
                id: user?.id,
                isAdmin: user?.isAdmin
                })
                resolve({
                    status: 200,
                    message: "Refresh token success!",
                    access_token
                })
            })
            
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
    
}

export default {genneralAccessToken, genneralRefeshToken, refeshToken}