import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const authMiddleware = (req, res, next) => {
    const token = req?.header('authorization')?.split(' ')[1]
  

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if(err) {
            console.log(err)
            return res.status(404).json({
                message: 'You do not have permission!1',
                status: 'ERROR'
            })
        }
        if (user?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                message: 'You do not have permission!',
                status: 'ERROR'
            }) 
        }
    })
}

export {authMiddleware}