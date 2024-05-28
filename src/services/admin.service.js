import { Account } from "../models/account.model.js";
import bcrypt from "bcrypt";
import jwtService from "./jwt.service.js";
import { FormCustomer } from "../models/formCustomer.model.js";
import { Blog } from "../models/blog.model.js";
import { blogStatusEnum } from "../enums/blogStatus.enum.js"
// import { accountTypeEnum } from "../enums/accountType.enum.js";


let loginUser = (username, password) => {

    return new Promise(async (resolve, reject) => {
        try {
            let user = await Account.findOne({
                username: username
            });
         
            if (!user) {
                reject({
                    status: 400,
                    message: "Incorrect username!",
                })
            }
            let checkPassword = bcrypt.compareSync(password, user.password);

            if (!checkPassword) {
                reject({
                    status: 400,
                    message: "Incorrect username!",
                })
            }
             const access_token = await jwtService.genneralAccessToken({
                id:user._id,
                isAdmin: !!user.type
            })
            const refesh_token = await jwtService.genneralRefeshToken({
                id:user._id,
                isAdmin: !!user.type
            })
            resolve({
                status: 200,
                message: "Login Successfully!",
                user,
                access_token,
                refesh_token
            })
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
}

let getListForm = (limit = 20, page = 0, search) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalForm = await FormCustomer.countDocuments();
      if (search) {
        const formsSearch = await FormCustomer.find({ $regex : search})
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1 });
        resolve({
          status: 200,
          message: "SUCCESS",
          data: formsSearch,
          total: totalForm,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalForm / limit),
        });
      }
      const forms = await FormCustomer.find()
        .limit(limit)
        .skip(page * limit)
        .sort({ createdAt: -1 });
      resolve({
        status: 200,
        message: "SUCCESS",
        data: forms,
        total: totalForm,
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
      const { id } = data.params;
      const form = await FormCustomer.findOne({ _id: id });
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
            const {title, description, thumbnail, content, tags, status} = data.body;
            const blog = await Blog.findOne({ slug: slug });
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


export default { loginUser, getListForm, getDetailForm, getListBlog, createBlog, updateBlog, getDetailBlog, deleteBlog };