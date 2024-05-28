import express from "express";
const router = express.Router();

import {createForm} from "../../controllers/form.controller.js"

router.post('/create-form', createForm)

export default router