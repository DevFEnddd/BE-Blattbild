import { Blog } from "../models/blog.model.js";
import bcrypt from "bcrypt";
import {genneralAccessToken, refeshAccessToken} from "./jwt.service.js";


let listBlog = (username, password) => {

    return new Promise(async (resolve, reject) => {
        try {
            
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



export default { listBlog, createBlog, updateBlog };
