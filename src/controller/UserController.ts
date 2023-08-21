import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { SignupSchema } from "../dtos/signup.dto"
import { GetUsersSchema } from "../dtos/getUsers.dto"
import { LoginSchema } from "../dtos/login.dto"
import { ZodError } from "zod"
import { BaseError } from "../errors/BaseErrors"



export class UserController {
    constructor(private userBusiness: UserBusiness) {

    }

    //
    //Get Users
    //
    public getUsers = async (req: Request, res: Response) => {
        try {
            const input = GetUsersSchema.parse({
                q: req.query.q,
                token: req.headers.authorization
            })


            const output = await this.userBusiness.getUsers(input)

            res.status(200).send(output)

        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }
            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Unexpected error.")
            }
        }

    }

    //
    //Create User
    //
    public createUser = async (req: Request, res: Response) => {
        try {
            const input = SignupSchema.parse({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,
            })


            const output = await this.userBusiness.signUp(input)

            res.status(201).send(output)


        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }
            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Unexpected error.")
            }
        }
    }


    public login = async (req: Request, res: Response) => {
        try {
            const input = LoginSchema.parse({
                email: req.body.email,
                password: req.body.password
            })

            const output = await this.userBusiness.login(input)
            res.status(200).send(output)
        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }
            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Unexpected error.")
            }
        }

    }

}