import express from "express";
const router = express.Router();

import {listForm, detailForm} from "../controllers/form.controller.js"
import {authMiddleware} from "../middleware/authMiddleware.js"

router.get('/list',authMiddleware, listForm)
router.get('/detail-form/:id',authMiddleware, detailForm)

export default router