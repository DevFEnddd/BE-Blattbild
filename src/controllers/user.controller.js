
import UserService from '../services/user.service.js'


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
        console.log("1111",response)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
}



export  {loginUser};