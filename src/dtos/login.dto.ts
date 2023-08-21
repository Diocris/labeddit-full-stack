import z from "zod"

export interface LoginInputDTO {
    email: string,
    password: string
}

export interface LoginOutputDTO {
    message: string,
    token: string
}

export const LoginSchema = z.object({
    email: z.string({ required_error: "An email is expected on body.", invalid_type_error: "Email format invalid." }).email(),
    password: z.string({ required_error: "A password is expected on body.", invalid_type_error: "" }).min(4, "Try at leat 4 digits.")
}).transform(data => data as LoginInputDTO)