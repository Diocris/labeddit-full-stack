import express from "express"
import { UserController } from "../controllers/UserController"
import { UserBusiness } from "../business/UserBusiness"
import { UserDatabase } from "../database/UserDatabase"
import { IdGenerator } from "../services/idGenerator"
import { TokenManager } from "../services/TokenManager"
import { HashManager } from "../services/HashManager"


export const userRouter = express.Router()


const userController = new UserController(new UserBusiness(new UserDatabase(), new IdGenerator(), new TokenManager(), new HashManager()))

userRouter.get("/", userController.getUsers)
userRouter.post("/signup", userController.createUser)
userRouter.post("/login", userController.login)
