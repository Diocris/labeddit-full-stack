import z from "zod"

export interface CommentPostInputDTO {
    token: string,
    postId: string,
    comment: string
}

export interface CommentPostOutputDTO {
    message: string
}

export const CommentPostSchema = z.object({
    token: z.string({required_error: "Token is required.", invalid_type_error: "Invalid token format."}),
    postId: z.string({required_error:"Post id is required", invalid_type_error: "Invalid post id format."}),
    comment: z.string({required_error: "Comment id is required", invalid_type_error:"Invalid comment id format"})
}).transform(data => data as CommentPostInputDTO)