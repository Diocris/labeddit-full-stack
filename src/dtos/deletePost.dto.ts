import z from "zod"

export interface DeletePostInputDTO {
    token: string,
    postId: string
}

export interface DeletePostOutputDTO {
    message: string
}

export const DeletePostSchema = z.object({
    token: z.string({ required_error: "A JWT Token is expected on authorization headers.", invalid_type_error: "Invalid Authorization token format." }).min(5),
    postId: z.string({ required_error: "The post id is expected on the params.", invalid_type_error: "Post id should be a string." }).min(1)

}).transform(data => data as DeletePostInputDTO)