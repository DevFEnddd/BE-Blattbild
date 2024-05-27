
import UserService from '../services/user.service.js'
import JwtService from '../services/jwt.service.js'
import jwt from 'jsonwebtoken'


const loginUser = async (req, res, next) => {
    const { username, password  } = req.body
    try {
        if (!username || !password) {
            return res.status(500).json({
                status: 'ERR',
                message: 'the input is required'
            })
        }
        const response = await UserService.loginUser(username, password)
       
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
}

const logoutUser = async (req, res, next) => {
    const { username, password  } = req.body
    try {
        
        res.clearCookie("refresh_token")
        return res.status(200).json({
            status: 200,
            message: "Logout Success!",
        })
    } catch(err) {
        console.error(err);
        return next(err);
    }
}
const refreshToken = async (req, res, next) => {
    try {
        const token = req.headers.token.split(' ')[1]
        if(!token){
            return res.status(404).json({
                status: 404,
                message: "Token expired!",
            })
        }
        const response = await JwtService.refeshToken(token)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
        return next(err);
    }
}




export  {loginUser, logoutUser, refreshToken};