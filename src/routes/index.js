import AdminRouter from "./admin/admin.routes.js"
import BlogRouter from "./client/blog.routes.js"
import FormRouter from "./client/form.routes.js"
import CategoryRouter from "./client/category.routes.js"
import express from "express";

const routes = (app) => {
    app.use('/api/admin', AdminRouter)
    app.use('/api/blog', BlogRouter)
    app.use('/api/form', FormRouter)
    app.use('/api/category', CategoryRouter)
    app.use('/uploads', express.static('uploads'))
}

export default routes