import { Form } from "../models/formCustomer.model.js";
import { blogStatusEnum } from "../enums/blogStatus.enum.js"
 

let getListForm = (limit = 20, page = 0) => {

    return new Promise(async (resolve, reject) => {
        try {
            const totalForm = await Form.countDocuments();
            const forms = await Form.find().limit(limit).skip((page * limit) )
            resolve({
                status: 200,
                message: "SUCCESS",
                data: forms,
                total: totalForm,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalForm/limit)
            })
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
} 

let getDetailForm = (data) => {

    return new Promise(async (resolve, reject) => {
        try {
            const { id } = data.params;
            const form = await Form.findOne({ _id: id});
            if(!form) {
                resolve({
                    status: 404,
                    message: "Form not found!"
                });
            }
            resolve({
                status: 200,
                message: "SUCCESS",
                data: form,
            })
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
} 





export default { getListForm, getDetailForm };
