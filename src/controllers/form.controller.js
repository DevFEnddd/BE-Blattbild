import FormServices from '../services/form.service.js'


const createForm = async (req, res, next) => {
    try {
        const { name,
          email,
          phone,
          form } = req.body

          if (!name) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Validation Name!'
            })
          }
          if (!email) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Validation Email!'
            })
          }
          if (!phone) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Validation Phone!'
            })
          }
          if (!form) {
            return res.status(500).json({
                status: 'ERR',
                message: 'Validation Form!'
            })
          }
        const response = await FormServices.createForm(req)
        return res.status(200).json(response)
    } catch(err) {
        console.error(err);
      return next(err);
    }
} 

export  {createForm};
