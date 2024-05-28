import express from "express";
const router = express.Router();

import {listCategory} from "../../controllers/category.controller.js"

router.get('/list', listCategory)

export default router