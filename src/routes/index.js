import BlogRouter from "./blog.routes.js"
import AdminRouter from "./users.routes.js"

const routes = (app) => {
    // app.use('/api/admin', BlogRouter)
    app.use('/api/user', AdminRouter)
}

export default routes