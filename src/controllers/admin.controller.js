
import AdminService from '../services/admin.service.js'
import JwtService from '../services/jwt.service.js'

const loginUser = async (req, res, next) => {
    const { username, password  } = req.body
    try {
        if (!username || !password) {
            return res.json({
                status: 400,
                message: 'the input is required'
            })
        }
        const response = await AdminService.loginUser(username, password)
        const { refresh_token, ...newResponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: "/"
        })
        return res.status(200).json(newResponse)
    } catch(err) {
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
    } catch(err) {
        console.error(err);
        return next(err);
    }
}
const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies?.refresh_token
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
const listForm = async (req, res, next) => {
    try {
        const { limit , page, search } = req.query
        const response = await AdminService.getListForm(Number(limit) || 10 , Number(page) || 0, search)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
} 
const detailForm = async (req, res, next ) => {

    try { 
        const response = await AdminService.getDetailForm(req)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
}

const listBlog = async (req, res, next) => {
    try {
        const { limit , page, sort } = req.query
        const response = await AdminService.getListBlog(Number(limit) || 20 , Number(page) || 0, sort)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
} 

const detailBlog = async (req, res, next ) => {

    try { 
        const response = await AdminService.getDetailBlog(req)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
}

const createBlog = async (req, res, next ) => {
    const {title, description, thumbnail, content, tags, slug, status} = req.body
    try {
        if (!title) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Missing required parameter!'
            })
        }
        const response = await AdminService.createBlog(req)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
}

const updateBlog = async (req, res, next ) => {

    try { 
        const response = await AdminService.updateBlog(req)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
}

const deleteBlog = async (req, res, next ) => {
  
    try {
        if (!req.params.id) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Missing required parameter!'
            })
        }
        const response = await AdminService.deleteBlog(req)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
}





export  {loginUser, logoutUser, refreshToken, listForm, detailForm, listBlog, createBlog, updateBlog, deleteBlog, detailBlog};