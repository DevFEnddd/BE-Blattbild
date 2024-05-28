import { Blog } from "../models/blog.model.js";
 

let getListBlog = (limit = 20, page = 0) => {

    return new Promise(async (resolve, reject) => {
        try {
            const totalBlog = await Blog.countDocuments();
            const blogs = await Blog.find({}).limit(limit).skip(page * limit).sort({ createdAt: -1 });
            resolve({
                status: 200,
                message: "SUCCESS",
                data: blogs,
                total: totalBlog,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalBlog/limit)
            })
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
} 

let getDetailBlog = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            const { slug } = data.params;
            const blog = await Blog.findOne({ slug: slug});
            if(!blog) {
                resolve({
                    status: 404,
                    message: "The blog is not found"
                });
            }
            resolve({
                status: 200,
                message: "SUCCESS",
                data: blog,
            })
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
} 


export default { getListBlog, getDetailBlog};