import z from "zod"
import { USER_ROLES } from "../models/UserModel"

export interface SignupInputDTO {
    name: string,
    email: string,
    password: string,
    role: USER_ROLES
}

export interface SignupOutputDTO {
    message: string,
    token: string
}

export const SignupSchema = z.object({
    name: z.string({ required_error: "Name is required on body.", invalid_type_error: "Name must be a string." }).min(2, "Name must have more than 2 digits."),
    email: z.string({ required_error: "Email is required on body.", invalid_type_error: "Email must be a string." }).email("Invalid email."),
    password: z.string({ required_error: "Password is required on body.", invalid_type_error: "Password must be a string" }).min(4, "Password must have more than 4 digits."),
}).transform(data => data as SignupInputDTO)