import AdminService from '../services/admin.service.js'
import JwtService from '../services/jwt.service.js'

const loginUser = async (req, res, next) => {
    const {username, password} = req.body
    try {
        if (!username || !password) {
            return res.json({
                status: 400,
                message: 'the input is required'
            })
        }
        const response = await AdminService.loginUser(username, password)
        return res.status(response?.status ?? 400).json(response)
    } catch (err) {
        console.error(err);
        return next(err);
    }
}

const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie("refresh_token")
        return res.status(200).json({
            status: 200,
            message: "Logout Success!",
        })
    } catch (err) {
        console.error(err);
        return next(err);
    }
}
const refreshToken = async (req, res, next) => {
    try {
        const {refresh_token} = req.body
        if (!refresh_token) {
            return res.status(404).json({
                status: 404,
                message: "Token expired!",
            })
        }
        const response = await JwtService.refeshToken(refresh_token)
        return res.status(200).json(response)
    } catch (err) {
        console.error(err);
        return next(err);
    }
}
const getUser = async (req, res, next) => {
    const {username} = req.body;
    try {
        if (!username) {
            return res.status(400).json({
                status: 400,
                message: 'Username is required',
            });
        }

        const user = await AdminService.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            status: 200,
            user,
        });
    } catch (err) {
        console.error(err);
        return next(err);
    }
};
const listForm = async (req, res, next) => {
    try {
        const {limit, page, search} = req.query
        const response = await AdminService.getListForm(Number(limit) || 10, Number(page) || 0, search)
        return res.status(200).json(response)
    } catch (err) {
        console.error(err);
        return next(err);
    }
}
const detailForm = async (req, res, next) => {

    try {
        const response = await AdminService.getDetailForm(req)
        return res.status(200).json(response)
    } catch (err) {
        console.error(err);
        return next(err);
    }
}

const listBlog = async (req, res, next) => {
    try {
        const {limit, page, sort, status, search} = req.query
        const response = await AdminService.getListBlog(10, Number(page) || 0, sort, status, search)
        return res.status(200).json(response)
    } catch (err) {
        console.error(err);
        return next(err);
    }
}
const getTotalBlog = async (req, res, next) => {
    try {
        const response = await AdminService.getTotalBlog();
        return res.status(200).json(response)
    } catch (err) {
        console.error(err);
        return next(err);
    }
}
const detailBlog = async (req, res, next) => {
    try {
        const {id} = req.query;

        if (!id) {
            return res.status(400).json({message: "ID is required"});
        }

        const response = await AdminService.getDetailBlog(id);
        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return next(err);
    }
};


const createBlog = async (req, res, next) => {
    console.log(req.body)
    const {title, description, thumbnail, content, tags, slug, status, headingContent} = req.body
    try {
        if (!title) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Missing required parameter!'
            })
        }
        const response = await AdminService.createBlog(req)
        return res.status(200).json(response)
    } catch (err) {
        console.error(err);
        return next(err);
    }
}

const updateBlog = async (req, res, next) => {

    try {
        const response = await AdminService.updateBlog(req)
        return res.status(200).json(response)
    } catch (err) {
        console.error(err);
        return next(err);
    }
}

const updateStatusBlog = async (req, res, next) => {

    try {
        const response = await AdminService.updateStatusBlog(req)
        return res.status(200).json(response)
    } catch (err) {
        console.error(err);
        return next(err);
    }
}
const deleteBlog = async (req, res, next) => {

    try {
        if (!req.params.id) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Missing required parameter!'
            })
        }
        const response = await AdminService.deleteBlog(req)
        return res.status(200).json(response)
    } catch (err) {
        console.error(err);
        return next(err);
    }
}


export {
    loginUser,
    logoutUser,
    refreshToken,
    listForm,
    detailForm,
    listBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    detailBlog,
    getUser,
    getTotalBlog,
    updateStatusBlog
};