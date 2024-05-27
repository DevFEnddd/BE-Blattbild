import express from "express";
const router = express.Router();

import {listBlog, createBlog, updateBlog, deleteBlog, detailBlog} from "../../controllers/blog.controller.js"
import {authMiddleware} from "../../middleware/authMiddleware.js"

router.get('/list', listBlog)
router.get('/detail-blog/:slug', detailBlog)

export default router