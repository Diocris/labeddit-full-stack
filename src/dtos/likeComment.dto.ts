import z from "zod"

export interface LikeCommentInputDTO {
    token: string,
    postId: string,
    commentId: string,
    like: boolean
}

export type LikeCommentOutputDTO = string | undefined

export const LikeCommentInputSchema = z.object({
    token: z.string(),
    postId: z.string(),
    commentId: z.string(),
    like: z.boolean()
}).transform(data => data as LikeCommentInputDTO)