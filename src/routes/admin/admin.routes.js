import express from "express";
const router = express.Router();

// import listBlog from "../controllers/blog.controller.js"
import {loginUser, logoutUser, refreshToken, listForm, detailForm, listBlog, createBlog, updateBlog, deleteBlog, detailBlog} from "../../controllers/admin.controller.js"
import {authMiddleware} from "../../middleware/authMiddleware.js"


router.post('/login', loginUser)
router.post('/logout', logoutUser)
router.post('/refresh-token', refreshToken)
// form admin
router.get('/list',authMiddleware, listForm)
router.get('/detail-form/:id',authMiddleware, detailForm)
// blog admin
router.get('/list',authMiddleware, listBlog)
router.get('/detail-blog/:slug',authMiddleware, detailBlog)
router.post('/new',authMiddleware, createBlog)
router.put('/update-blog/:slug',authMiddleware, updateBlog)
router.delete('/delete-blog/:id',authMiddleware, deleteBlog)



export default router