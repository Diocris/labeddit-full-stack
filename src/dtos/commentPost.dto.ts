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
    token: z.string(),
    postId: z.string(),
    comment: z.string()
}).transform(data => data as CommentPostInputDTO)