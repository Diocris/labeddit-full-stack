
import { CommentsDB } from "../../src/models/CommentModel";
import { PostsDB } from "../../src/models/PostModel";
import { BaseDatabase } from "../../src/database/BaseDatabase";

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
    //Create Post
    //
    public async createNewPost(input: PostsDB): Promise<void> {

    }



    //
    //Edit Post
    //
    public async editPost(input: PostsDB): Promise<void> {

    }
    //
    //Edit like or dislike post.
    public async editLikePost(postId: string, newLikes: number, newDislikes: number) {

    }

    public async editDislLikePost(input: any, newValue: number) {

    }
    //
    //
    //Add like to post
    //
    public async setLike(id: string, likes: number) {

    }
    //
    //Add dislike to post
    //
    public async setDislike(id: string, dislikes: number) {

    }




    //Delete Post
    public async deletePost(input: string): Promise<void> {

    }

    //Create comment
    public async commentPost(input: CommentsDB): Promise<void> {

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

    }

    //get Likes
    public async getCommentLikesByCommentId(input: any) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).where({ user_id: input.user_id, comment_id: input.comment_id })
    }
    //get Dislikes
    public async getCommentLikes(input: string) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).where({ comment_id: input, like: 1 }).count()
    }
    //get Dislikes
    public async getCommentDislikes(input: string) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).where({ comment_id: input, like: 0 }).count()
    }

    //get full post
    public async getPost(input: string) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_TABLE).where({ post_id: input })
    }

    //delete Like
    public async deleteLike(input: any) {

    }


    //edit comment post like/dislike
    public async editCommentPost(commentId: string, newLikes: number, newDislikes: number) {

    }

    //edit comment like
    public async editCommentLike(input: any) {

    }
}