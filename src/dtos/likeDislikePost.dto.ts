import z from "zod"

export interface LikeDislikeInputDTO {
    token: string,
    postId: string,
    like: boolean
}

export type LikeDislikeOutputDTO = string | undefined


export const LikeDislikeSchema = z.object({
    token: z.string({ required_error: "A JWT Token is expected on authorization headers.", invalid_type_error: "Invalid Authorization token format." }).min(1),
    postId: z.string({ required_error: "The post id is expected on the params.", invalid_type_error: "Post id should be a string." }).min(1),
    like: z.boolean({ required_error: "A boolean value is expected where true is like and false is dislike on body.", invalid_type_error: "A boolean value is expected." })
}).transform(data => data as LikeDislikeInputDTO)