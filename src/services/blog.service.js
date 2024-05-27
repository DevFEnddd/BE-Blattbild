import { Blog } from "../models/blog.model.js";
import {genneralAccessToken, refeshAccessToken} from "./jwt.service.js";
import { blogStatusEnum } from "../enums/blogStatus.enum.js"
 

let getListBlog = (limit = 20, page = 0, sort , status) => {

    return new Promise(async (resolve, reject) => {
        try {
            const totalBlog = await Blog.countDocuments();
            if (sort || status) {
                const blogsFind = await Blog.find({
                    status: status,
                    title: { '$regex' : search}
                }).limit(limit).skip(page * limit).sort({
                    createdAt: sort
                })
                resolve({
                    status: 200,
                    message: "SUCCESS",
                    data: blogsFind,
                    total: totalBlog,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalBlog/limit)
                })
            }
            const blogs = await Blog.find().limit(limit).skip(page * limit).sort({ createdAt: -1 });
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
                    status: 500,
                    message: "The blog is not defined"
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

let createBlog = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            const {title, description, thumbnail, content, tags, status} = data.body
            const file = data.file;
            let location = file?.location;
            const newBlog = await Blog.create({
                title,
                description,
                content: content || "",
                thumbnail: thumbnail || location,
                tags,
                status,
            });
            if (newBlog) {
                resolve({
                    status: "200",
                    messsage: "SUCCESS",
                    data: newBlog
                })
            }
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
}

let updateBlog = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            const { slug } = data.params;
            const blog = await Blog.findOne({ slug: slug });
            if (!blog) {
                resolve({
                    status: "500",
                    message: "Blog không tồn tại!"
                })
            }
            
            const {title, description, thumbnail, content, tags, status} = data.body;
            let isChange = false;
            if (title && blog.title !== title) {
                blog.title = title;
                isChange = true;
            }
            if (description && blog.description !== description) {
                blog.description = description;
                isChange = true;
            }
            if (thumbnail && blog.thumbnail !== thumbnail) {
                blog.thumbnail = thumbnail;
                isChange = true;
            }
            if (content && blog.content !== content) {
                blog.content = content;
                isChange = true;
            }
            if (tags && blog.tags !== tags) {
                blog.tags = tags;
                isChange = true;
            }
            if (status && blog.status !== status) {
                blog.status = status;
                isChange = true;
            }
            if (isChange) await blog.save();
            resolve({
                status: 200,
                message: "Update Blog Success!",
                data: blog
            })
          
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
}

let deleteBlog = () => {

    return new Promise(async (resolve, reject) => {
        try {
            const { id } = req.params;
            const checkDelete = await Blog.findOne({
                _id: id,
                status: { $ne: blogStatusEnum.DELETED },
              });
            if (!checkDelete) resolve("Blog not found");
            await Blog.findByIdAndUpdate(id, { $set: { status: blogStatusEnum.DELETED } }, { new: true });
            resolve({
                status: 200,
                message: "Delete Blog Success!"
            })
          
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
} 



export default { getListBlog, createBlog, updateBlog, getDetailBlog, deleteBlog };
