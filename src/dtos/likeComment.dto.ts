import z from "zod"

export interface LikeCommentInputDTO {
    token: string,
    postId: string,
    commentId: string,
    like: boolean
}

export type LikeCommentOutputDTO = string | undefined

export const LikeCommentInputSchema = z.object({
    token: z.string({ required_error: "Token required.", invalid_type_error: "Invalid token format." }),
    postId: z.string({ required_error: "Post ID required.", invalid_type_error: "Invalid post id format." }),
    commentId: z.string({ required_error: "Comment ID required.", invalid_type_error: "Invalid comment id format." }),
    like: z.boolean({ required_error: "A boolean value is required.", invalid_type_error: "Invalid like format, it should be a boolean value." })
}).transform(data => data as LikeCommentInputDTO)