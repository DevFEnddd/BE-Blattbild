import BlogServices from '../services/blog.service.js'


const listBlog = async (req, res, next) => {
    try {
        const { limit , page } = req.query
        const response = await BlogServices.getListBlog(Number(limit) || 10 , Number(page) || 0 )
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




export  {listBlog, detailBlog};