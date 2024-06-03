import {Account} from "../models/account.model.js";
import bcrypt from "bcrypt";
import jwtService from "./jwt.service.js";
import {FormCustomer} from "../models/formCustomer.model.js";
import {Blog} from "../models/blog.model.js";
import {blogStatusEnum} from "../enums/blogStatus.enum.js"
// import { accountTypeEnum } from "../enums/accountType.enum.js";
import mongoose from 'mongoose';
import {Category} from "../models/category.model.js";
import {categoryTypeEnum} from "../enums/categoryType.enum.js";

const statusMapping = {
    published: blogStatusEnum.PUBLISHED,
    draft: blogStatusEnum.DRAFT,
    deleted: blogStatusEnum.DELETED
};

let loginUser = (username, password) => {

    return new Promise(async (resolve, reject) => {
        try {
            let user = await Account.findOne({
                username: username
            });
            if (!user) {
                resolve({
                    status: 400,
                    message: "Incorrect username!",
                })
            }
            let checkPassword = bcrypt.compareSync(password, user?.password);

            if (!checkPassword) {
                resolve({
                    status: 400,
                    message: "Incorrect password!",
                })
            }
            const access_token = await jwtService.genneralAccessToken({
                id: user._id,
                isAdmin: !!user.type
            })
            const refresh_token = await jwtService.genneralRefeshToken({
                id: user._id,
                isAdmin: !!user.type
            })
            resolve({
                status: 200,
                message: "Login Successfully!",
                user,
                access_token,
                refresh_token
            })
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
}
const getUserByUsername = (username) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await Account.findOne({
                username: username
            });
            if (!user) {
                resolve({
                    status: 404,
                    message: "User not found!",
                });
            }
            resolve({
                status: 200,
                message: "User found successfully!",
                user,
            });
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    });
};

// form
let getListForm = (limit = 10, page = 0, search) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalForm = await FormCustomer.countDocuments();
            if (search) {
                const formsSearch = await FormCustomer.find({$regex: search})
                    .limit(limit)
                    .skip(page * limit)
                    .sort({createdAt: -1});
                resolve({
                    status: 200,
                    message: "SUCCESS",
                    data: formsSearch,
                    totalForm,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalForm / limit),
                });
            }
            const forms = await FormCustomer.find()
                .limit(limit)
                .skip(page * limit)
                .sort({createdAt: -1});
            resolve({
                status: 200,
                message: "SUCCESS",
                data: forms,
                totalForm,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalForm / limit),
            });
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    });
};
let getDetailForm = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {id} = data.params;
            const form = await FormCustomer.findOne({_id: id});
            if (!form) {
                resolve({
                    status: 404,
                    message: "Form not found!",
                });
            }
            resolve({
                status: 200,
                message: "SUCCESS",
                data: form,
            });
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    });
};

// blog
let getListBlog = (limit = 10, page = 0, sort, status, search) => {
    return new Promise(async (resolve, reject) => {
        try {
            const filter = {
                status: {$ne: blogStatusEnum.DELETED},
                ...(search && {title: {$regex: search, $options: 'i'}}),
                ...(status !== undefined && statusMapping[status] !== undefined && {status: statusMapping[status]}) // Thêm
            };

            const totalBlog = await Blog.countDocuments(filter);

            const query = Blog.find(filter).populate("tags").limit(limit).skip(page * limit);

            if (sort) {
                switch (sort) {
                    case 'oldest':
                        query.sort({createdAt: 1}); // Oldest first
                        break;
                    case 'latest':
                        query.sort({createdAt: -1}); // Latest first
                        break;
                    case 'popular':
                        query.sort({views: -1}); // Most popular (assuming 'views' field tracks popularity)
                        break;
                    default:
                        query.sort({createdAt: -1}); // Default to latest
                        break;
                }
            } else {
                query.sort({createdAt: -1}); // Default to latest
            }

            const blogs = await query;


            resolve({
                status: 200,
                message: "SUCCESS",
                data: blogs,
                total: totalBlog,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalBlog / limit)
            });
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    });
};
let getDetailBlog = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const blog = await Blog.findById(id).populate("tags");
            if (!blog) {
                resolve({
                    status: 404,
                    message: "Blog not found",
                });
            }
            resolve({
                status: 200,
                message: "SUCCESS",
                data: blog,
            });
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    });
};
let createBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {title, description, thumbnail, content, tags, status, headingContent} = data.body;
            const file = data.file;
            let location = file?.location;

            const tagIds = await Promise.all(tags.map(async (tag) => {
                let category = await Category.findOne({title: tag, type: categoryTypeEnum.WEBSITES});
                if (!category) {
                    category = await Category.create({title: tag, type: categoryTypeEnum.WEBSITES});
                }
                return category._id;
            }));

            const newBlog = await Blog.create({
                title,
                description,
                content: content || "",
                thumbnail: thumbnail || location,
                tags: tagIds,
                status,
                headingContent
            });

            if (newBlog) {
                resolve({
                    status: "200",
                    message: "SUCCESS",
                    data: newBlog
                });
            }
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    });
};
let updateBlog = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            const {slug} = data.params;
            const {title, description, thumbnail, content, tags, status, headingContent, id} = data.body;
            let blog;
            if (!id) {
                resolve({
                    status: "500",
                    message: "Blog không tồn tại!"
                })
            } else {
                blog = await Blog.findById(id);
            }
            if (!blog) {
                resolve({
                    status: "500",
                    message: "Blog không tồn tại!"
                })
            }

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
let deleteBlog = (req) => {

    return new Promise(async (resolve, reject) => {
        try {
            const {id} = req.params;
            const checkDelete = await Blog.findOne({
                _id: id,
                status: {$ne: blogStatusEnum.DELETED},
            });
            console.log(checkDelete, id)
            if (!checkDelete) resolve("Blog not found");
            await Blog.findByIdAndUpdate(id, {$set: {status: blogStatusEnum.DELETED}}, {new: true});
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


export default {
    getUserByUsername,
    loginUser,
    getListForm,
    getDetailForm,
    getListBlog,
    createBlog,
    updateBlog,
    getDetailBlog,
    deleteBlog
};
