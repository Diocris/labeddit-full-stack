
import { CommentsDB } from "../models/CommentModel";
import { PostsDB } from "../models/PostModel";
import { BaseDatabase } from "./BaseDatabase";

export class PostsDatabase extends BaseDatabase {
    public static POSTS_TABLE = "posts"

    public static COMMENTS_TABLE = "comments_posts"

    public static COMMENTS_LIKES = "comments_likes"

    //
    //Get Posts
    //
    public async getPosts(q?: string): Promise<PostsDB[]> {
        let result: PostsDB[] = []

        if (q) {
            result = await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).where({ id: q })
        } else {
            result = await BaseDatabase.connection(PostsDatabase.POSTS_TABLE)
        }

        return result
    }

    //
    //Get Posts by Id
    //
    public async getPostsById(q: string) {
        return await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).where({ id: q })
    }
    //
    //Create Post
    //
    public async createNewPost(input: PostsDB): Promise<void> {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).insert(input)
    }



    //
    //Edit Post
    //
    public async editPost(input: PostsDB): Promise<void> {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).update(input).where({ id: input.id })
    }
    //
    //Edit like or dislike post.
    public async editLikePost(postId: string, newLikes: number, newDislikes: number) {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).update({ likes: newLikes, dislikes: newDislikes }).where({ id: postId })
    }

    public async editDislLikePost(input: any, newValue: number) {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).update({ dislikes: newValue }).where({ id: input.id })
    }
    //
    //
    //Add like to post
    //
    public async setLike(id: string, likes: number) {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).update({ likes }).where({ id })
    }
    //
    //Add dislike to post
    //
    public async setDislike(id: string, dislikes: number) {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).update({ dislikes }).where({ id })
    }




    //Delete Post
    public async deletePost(input: string): Promise<void> {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).del().where({ id: input })
    }

    //Create comment
    public async commentPost(input: CommentsDB): Promise<void> {
        await BaseDatabase.connection(PostsDatabase.COMMENTS_TABLE).insert(input)
    }


    //get Comments by Post
    public async getCommentsByPostId(input: string) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_TABLE).where({ post_id: input })
    }


    //get Comments by id
    public async getCommentsById(input: string) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_TABLE).where({ id: input })
    }


    //Like a comment
    public async likeComment(input: any): Promise<void> {
        await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).insert(input)
    }

    //get Likes
    public async getCommentLikesByCommentId(input: any) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).where({ user_id: input.user_id, comment_id: input.comment_id })
    }
    //get Dislikes
    public async getCommentLikes(input: string) {
        const result = await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).where({ comment_id: input, like: 1 }).count()
        return result[0]['count(*)']
    }
    //get Dislikes
    public async getCommentDislikes(input: string) {
        const result = await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).where({ comment_id: input, like: 0 }).count()
        return result[0]['count(*)']
    }

    //get full post
    public async getPost(input: string) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_TABLE).where({ post_id: input })
    }

    //delete Like
    public async deleteLike(input: any) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).del().where({ user_id: input.user_id, comment_id: input.comment_id })
    }


    //edit comment post like/dislike
    public async editCommentPost(commentId: string, newLikes: number, newDislikes: number) {
        await BaseDatabase.connection(PostsDatabase.COMMENTS_TABLE).update({ likes: newLikes, dislikes: newDislikes }).where({ id: commentId })
    }

    //edit comment like
    public async editCommentLike(input: any) {
        await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).update(input).where({ comment_id: input.comment_id })
    }
}