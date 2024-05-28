import express from "express";
const router = express.Router();

import {listBlog, detailBlog} from "../../controllers/blog.controller.js"

router.get('/list', listBlog)
router.get('/detail-blog/:slug', detailBlog)

export default router