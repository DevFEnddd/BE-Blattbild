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
const getListForm = async (limit = 10, page = 0, sortBy = 'latest', search) => {
    try {
        const sortOrder = sortBy === 'oldest' ? 1 : -1; // 1 for ascending (oldest), -1 for descending (latest)
        const query = search ? { name: { $regex: search, $options: 'i' } } : {};

        const totalForm = await FormCustomer.countDocuments(query);
        const forms = await FormCustomer.find(query)
            .limit(limit)
            .skip(page * limit)
            .sort({ createdAt: sortOrder });

        return {
            status: 200,
            message: "SUCCESS",
            data: forms,
            totalForm,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalForm / limit),
        };
    } catch (err) {
        console.log(err);
        throw new Error('Error fetching form data');
    }
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
                ...(status !== undefined && statusMapping[status] !== undefined && {status: statusMapping[status]})
            };

            const totalBlog = await Blog.countDocuments(filter);

            const query = Blog.find(filter).populate("tags").limit(limit).skip((page - 1) * limit);

            if (sort) {
                switch (sort) {
                    case 'oldest':
                        query.sort({createdAt: 1}); // Oldest first
                        break;
                    case 'latest':
                        query.sort({createdAt: -1}); // Latest first
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
            return reject({
                status: 500,
                message: "ERROR",
                error: err
            });
        }
    });
};

let getTotalBlog = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalDraft = await Blog.countDocuments({status: statusMapping.draft});
            const totalPublished = await Blog.countDocuments({status: statusMapping.published});

            resolve({
                status: 200,
                message: "SUCCESS",
                totalDraft: totalDraft,
                totalPublished: totalPublished
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
            const serverUrl = process.env.SERVER_URL;
            const filePath = file?.path.replace(/\\/g, '/');
            const fileUrl = filePath ? `${serverUrl}/${filePath}` : null;
            const tagsArr = tags.split(",");

            const tagIds = await Promise.all(tagsArr.map(async (tag) => {
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
                thumbnail: fileUrl,
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
            const {title, description, content, tags, status, headingContent, id} = data.body;
            const file = data.file;
            const serverUrl = process.env.SERVER_URL;
            const filePath = file?.path.replace(/\\/g, '/');
            const fileUrl = filePath ? `${serverUrl}/${filePath}` : null;

            if (!id) {
                return resolve({
                    status: "500",
                    message: "Blog không tồn tại!"
                });
            }

            let blog = await Blog.findById(id);
            if (!blog) {
                return resolve({
                    status: "500",
                    message: "Blog không tồn tại!"
                });
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
            if (fileUrl && blog.thumbnail !== fileUrl) {
                blog.thumbnail = fileUrl;
                isChange = true;
            }
            if (content && blog.content !== content) {
                blog.content = content;
                isChange = true;
            }

            if (tags) {
                const tagsArr = tags.split(",");
                const tagIds = await Promise.all(tagsArr.map(async (tag) => {
                    let category = await Category.findOne({title: tag, type: categoryTypeEnum.WEBSITES});
                    if (!category) {
                        category = await Category.create({title: tag, type: categoryTypeEnum.WEBSITES});
                    }
                    return category._id;
                }));

                if (blog.tags.toString() !== tagIds.toString()) {
                    blog.tags = tagIds;
                    isChange = true;
                }
            }

            if (status && blog.status !== status) {
                blog.status = status;
                isChange = true;
            }
            if (headingContent && blog.headingContent !== headingContent) {
                blog.headingContent = headingContent;
                isChange = true;
            }

            if (isChange) {
                await blog.save();
            }

            resolve({
                status: 200,
                message: "Update Blog Success!",
                data: blog
            });

        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    });
};

const updateStatusBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { id, status } = data.body;

            if (!id) {
                return resolve({
                    status: "500",
                    message: "Blog không tồn tại!"
                });
            }

            if (!status || (status !== 'draft' && status !== 'published')) {
                return resolve({
                    status: "400",
                    message: "Trạng thái không hợp lệ! Chỉ chấp nhận 'draft' hoặc 'published'."
                });
            }

            let blog = await Blog.findById(id);
            if (!blog) {
                return resolve({
                    status: "500",
                    message: "Blog không tồn tại!"
                });
            }

            if (blog.status !== statusMapping[status]) {
                blog.status = statusMapping[status];
                await blog.save();
                return resolve({
                    status: 200,
                    message: "Cập nhật trạng thái thành công!",
                    data: blog
                });
            } else {
                return resolve({
                    status: 200,
                    message: "Trạng thái không thay đổi!",
                    data: blog
                });
            }

        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    });
};

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
    deleteBlog,
    getTotalBlog,
    updateStatusBlog
};
