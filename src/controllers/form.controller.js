import FormServices from '../services/form.service.js'


const listForm = async (req, res, next) => {
    try {
        const { limit , page } = req.query
        const response = await FormServices.getListForm(Number(limit) , Number(page))
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
} 

const detailForm = async (req, res, next ) => {

    try { 
        const response = await FormServices.getDetailForm(req)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
}




export  {listForm, detailForm};