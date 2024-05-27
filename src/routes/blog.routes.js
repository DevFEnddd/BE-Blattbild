import express from "express";
const router = express.Router();

import {listBlog, createBlog, updateBlog, deleteBlog, detailBlog} from "../controllers/blog.controller.js"
import {authMiddleware} from "../middleware/authMiddleware.js"

router.get('/list',authMiddleware, listBlog)
router.get('/detail-blog/:slug',authMiddleware, detailBlog)
router.post('/new',authMiddleware, createBlog)
router.put('/update-blog/:slug',authMiddleware, updateBlog)
router.delete('/delete-blog/:id',authMiddleware, deleteBlog)

export default router