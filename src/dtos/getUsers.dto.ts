import z from "zod"
import { UserModel } from "../models/UserModel"

export interface GetUsersInputDTO {
    q: string,
    token: string
}


export type GetUsersOutputDTO = UserModel[] | UserModel

export const GetUsersSchema = z.object({
    q: z.string({ invalid_type_error: "id should be a string" }).min(1).optional(),
    token: z.string({ required_error: "Token must be passed.", invalid_type_error: "Token format invalid." }),
}).transform(data => data as GetUsersInputDTO)