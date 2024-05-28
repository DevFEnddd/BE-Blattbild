import { Category } from "../models/category.model.js";
 

let getListCategory = () => {

    return new Promise(async (resolve, reject) => {
        try {
            const totalCategory = await Category.countDocuments();
            const categories = await Category.find();
            resolve({
                status: 200,
                message: "SUCCESS",
                categories,
                total: totalCategory
            })
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
} 



export default { getListCategory };
