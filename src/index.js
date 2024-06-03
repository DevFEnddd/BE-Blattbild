import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import routes from './routes/index.js';
import {fileURLToPath} from "url";
import path from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
dotenv.config();

const vars = {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 3000,
    mongo: {
        uri: process.env.NODE_ENV === 'development' ? process.env.MONGO_URI_TESTS : process.env.MONGO_URI,
    },
};


const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

/* Routers */
routes(app);

/* Mongo Connection */
mongoose.connect(vars.mongo.uri)
    .then(() => console.log("Connect DB successs!"))
    .catch((err) => console.log(err));

app.listen(vars.port, () => {
    console.log(`Server started on port ${vars.port}`);
});
