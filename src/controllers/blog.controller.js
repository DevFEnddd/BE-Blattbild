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

export default listBlog;