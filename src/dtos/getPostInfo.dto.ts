import z from "zod"

export interface GetPostInfoInputDTO {
    token: string,
    id: string
}

export interface GetPostInfoOuputDTO {
    postId: string,
    postCreator: string,
    postContent: string,
    postLikes: number,
    postCreatedAt: string,
    postUpdatedAt: string,
    postComments: CommentDTO[]
}
export interface CommentDTO {
    commentId: string,
    commentUserId: string,
    commentUserName: string,
    commentContent: string,
    commentLikes: number,
    commentCreatedAt: string,
    commentUpdatedAt: string,
}

export const GetPostInfoSchema = z.object({
    token: z.string({ required_error: "Missing token.", invalid_type_error: "Invalid token format." }),
    id: z.string({ required_error: "Missing post id.", invalid_type_error: "Invalid post id format." })
}).transform(data => data as GetPostInfoInputDTO)