import { Category } from "../models/category.model";
 

let getListCategory = () => {

    return new Promise(async (resolve, reject) => {
        try {
            const totalCategory = await Category.countDocuments();
            const categories = await Category.find();
            resolve({
                status: 200,
                message: "SUCCESS",
                data: categories,
                total: totalCategory
            })
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
} 



export default { getListCategory };
