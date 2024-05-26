import express from "express";
const router = express.Router();

import {listForm, detailForm} from "../controllers/form.controller.js"

router.get('/list', listForm)
router.get('/detail-form/:id', detailForm)

export default router