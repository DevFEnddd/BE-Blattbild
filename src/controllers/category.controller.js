import CategoryServices from '../services/category.service.js'


const listCategory = async (req, res, next) => {
    try {
        const response = await CategoryServices.getListCategory()
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
} 

export  {listCategory};