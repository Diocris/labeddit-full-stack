import { PostsBusiness } from "../business/PostsBusiness";
import { Request, Response } from "express";
import { CreatePostSchema } from "../dtos/createPost.dto";
import { GetPostOutputDTO, GetPostsInputDTO, getPostsSchema } from "../dtos/getPosts.dto";
import { EditPostSchema, editPostInputDTO } from "../dtos/editPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO, DeletePostSchema } from "../dtos/deletePost.dto";
import { LikeDislikeInputDTO, LikeDislikeSchema } from "../dtos/likeDislikePost.dto";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseErrors";
import { CommentPostInputDTO, CommentPostOutputDTO, CommentPostSchema } from "../dtos/commentPost.dto";
import { LikeCommentInputSchema, LikeCommentOutputDTO } from "../dtos/likeComment.dto";
import { GetPostInfoSchema } from "../dtos/getPostInfo.dto";


export class PostsController {
    constructor(private postsBusiness: PostsBusiness) {

    }

    //
    //Get Posts
    //
    public getAllPosts = async (req: Request, res: Response) => {

        try {

            const input: GetPostsInputDTO = getPostsSchema.parse({
                auth: req.headers.authorization,
                id: req.query.id
            })
            console.log(input)
            const output: GetPostOutputDTO[] | GetPostOutputDTO = await this.postsBusiness.getAllPosts(input)


            res.status(200).send(output)


        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }
            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Unexpected error.")
            }
        }


    }

    //
    //Create Post
    //
    public createPost = async (req: Request, res: Response) => {
        try {

            const input = CreatePostSchema.parse({
                content: req.body.content,
                token: req.headers.authorization
            })

            const output = await this.postsBusiness.createPost(input)

            res.status(200).send(output)

        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }
            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Unexpected error.")
            }
        }
    }

    //
    //Edit Post
    //
    public editPost = async (req: Request, res: Response) => {
        try {
            const input: editPostInputDTO = EditPostSchema.parse({
                token: req.headers.authorization,
                postId: req.params.id,
                content: req.body.content
            })


            const output = await this.postsBusiness.editPost(input)

            res.status(200).send(output)

        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }
            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Unexpected error.")
            }
        }
    }

    public deletePost = async (req: Request, res: Response) => {
        try {
            const input: DeletePostInputDTO = DeletePostSchema.parse({
                token: req.headers.authorization,
                postId: req.params.id
            })


            const output: DeletePostOutputDTO = await this.postsBusiness.deletePost(input)

            res.status(200).send(output.message)

        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }
            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Unexpected error.")
            }
        }
    }

    //
    //Like Post
    //
    public likePost = async (req: Request, res: Response) => {
        try {
            const input: LikeDislikeInputDTO = LikeDislikeSchema.parse({
                token: req.headers.authorization,
                postId: req.params.id,
                like: req.body.like
            })

            const output = await this.postsBusiness.likePost(input)


            res.status(200).send(output)

        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }
            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Unexpected error.")
            }
        }
    }


    //
    //Get full post with comments
    //
    public getPost = async (req: Request, res: Response) => {
        try {
            const input = GetPostInfoSchema.parse({
                token: req.headers.authorization,
                id: req.params.id
            })

            const output = await this.postsBusiness.getPost(input)

            res.status(200).send(output)

        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }
            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Unexpected error.")
            }
        }
    }

    //
    //Comment in a post
    //
    public commentPost = async (req: Request, res: Response) => {
        try {
            const input: CommentPostInputDTO = CommentPostSchema.parse({
                token: req.headers.authorization,
                postId: req.params.id,
                comment: req.body.comment
            })

            const output: CommentPostOutputDTO = await this.postsBusiness.commentPost(input)

            res.status(200).send(output)

        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }
            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Unexpected error.")
            }
        }
    }

    //
    //like Comment
    //
    public likeComment = async (req: Request, res: Response) => {
        try {
            const input = LikeCommentInputSchema.parse({
                token: req.headers.authorization,
                postId: req.params.id,
                commentId: req.params.commentid,
                like: req.body.like
            })

            const output: LikeCommentOutputDTO = await this.postsBusiness.likeComment(input)

            res.status(200).send(output)

        } catch (error: any) {
            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            }
            else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send(error.message)
            }
        }
    }

}

