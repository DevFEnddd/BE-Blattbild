import { Blog } from "../models/blog.model.js";
 

let getListBlog = (limit, page ) => {

    return new Promise(async (resolve, reject) => {
        try {
            const totalBlog = await Blog.countDocuments();
            const blogs = await Blog.find({}).populate("tags").limit(limit).skip(page * limit).sort({ createdAt: -1 });
            resolve({
                status: 200,
                message: "SUCCESS",
                blogs,
                totalBlog,
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
            const blog = await Blog.findOne({ slug: slug}).populate("tags");
            if(!blog) {
                resolve({
                    status: 404,
                    message: "The blog is not found"
                });
            }
            resolve({
                status: 200,
                message: "SUCCESS",
                blog,
            })
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
} 


export default { getListBlog, getDetailBlog};