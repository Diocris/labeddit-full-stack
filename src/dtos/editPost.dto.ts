import z from "zod"

export interface editPostInputDTO {
    token: string,
    postId: string,
    content: string
}

export interface editPostOutputDTO {
    message: string
}

export const EditPostSchema = z.object({
    token: z.string({ required_error: "A JWT Token is expected on authorization headers.", invalid_type_error: "Invalid Authorization token format." }).min(1),
    postId: z.string({ required_error: "The post id is expected on the params.", invalid_type_error: "Post id should be a string." }).min(1),
    content: z.string({ required_error: "A new content is expected.", invalid_type_error: "Content should be a string" }).min(1)
}).transform(data => data as editPostInputDTO)