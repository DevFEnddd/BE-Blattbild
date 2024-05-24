import { Account } from "../models/account.model.js";
import bcrypt from "bcrypt";
import {genneralAccessToken, refeshAccessToken} from "./jwt.service.js";
import { accountTypeEnum } from "../enums/accountType.enum.js";


let loginUser = (username, password) => {

    return new Promise(async (resolve, reject) => {
        try {
            let user = await Account.findOne({
                username: username
            });
                console.log(user, username)

            if (!user) {
                resolve("Incorrect username.");
            }
            let checkPassword = bcrypt.compareSync(password, user.password);
            if (!checkPassword) {
                resolve("Incorrect password.");
            }
             const access_token = await genneralAccessToken({
                id:user.id,
                isAdmin: user.isAdmin
            })
            const refesh_token = await refeshAccessToken({
                id:user.id,
                isAdmin: user.isAdmin
            })
            resolve({user, access_token, refesh_token})
        } catch (err) {
            console.log(err);
            return reject(null, false);
        }
    })
}



export default { loginUser };
