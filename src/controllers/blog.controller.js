import showListBlog from '../services/blog.service.js'


const listBlog = async (req, res, next) => {
    try {
        console.log(req.body)
        const response = await showListBlog.listBlog()
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
                message: 'The input is required'
            })
        }
        const response = await showListBlog.createBlog(req)
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
        const response = await showListBlog.updateBlog(req)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
}

export  {listBlog, createBlog, updateBlog};