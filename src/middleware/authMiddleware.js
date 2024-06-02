import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const authMiddleware = (req, res, next) => {
    const token = req?.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(403).json({
            message: 'No token provided!',
            status: 'ERROR'
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'Invalid token!',
                status: 'ERROR'
            });
        }

        if (user?.isAdmin) {
            req.user = user;
            next();
        } else {
            return res.status(403).json({
                message: 'You do not have permission!',
                status: 'ERROR'
            });
        }
    });
}

export {authMiddleware}