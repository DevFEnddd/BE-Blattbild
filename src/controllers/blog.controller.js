import BlogServices from '../services/blog.service.js'


const listBlog = async (req, res, next) => {
    try {
        const { limit , page, sort } = req.query
        const response = await BlogServices.getListBlog(Number(limit) , Number(page), sort)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
} 

const detailBlog = async (req, res, next ) => {

    try { 
        const response = await BlogServices.getDetailBlog(req)
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
        const response = await BlogServices.createBlog(req)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
}

const updateBlog = async (req, res, next ) => {
    console.log(res)
 
    // const {title, description, thumbnail, content, tags, slug, status} = req.body
    try { 
        const response = await BlogServices.updateBlog(req)
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
        const response = await BlogServices.deleteBlog(req)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
}



export  {listBlog, createBlog, updateBlog, deleteBlog, detailBlog};