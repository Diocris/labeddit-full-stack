import z, { object } from "zod"

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

export const GetPostInfoSchema = z.object({}).transform(data => data as GetPostInfoInputDTO)