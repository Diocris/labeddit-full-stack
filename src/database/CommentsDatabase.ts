import { input } from "zod";
import { BaseDatabase } from "./BaseDatabase";

export class CommentsDatabase extends BaseDatabase {
    public static COMMENTS_POSTS_TABLE = "comments_posts"

    public async getComments() {
        return await BaseDatabase.connection(CommentsDatabase.COMMENTS_POSTS_TABLE)
    }

    public async getCommentsByPostId(input: string) {
        return await BaseDatabase.connection(CommentsDatabase.COMMENTS_POSTS_TABLE).where({ post_id: input })
    }

    public async commentsCount(input: string) {
        return await BaseDatabase.connection(CommentsDatabase.COMMENTS_POSTS_TABLE).where({ post_id: input }).count()
    }

    public async countLike(input: any) {
        const result = await BaseDatabase.connection(CommentsDatabase.COMMENTS_POSTS_TABLE).where({ post_id: input, like: 1 }).count()
   
        return result[0]['count(*)']
    }
    public async countDislike(input: any) {
        const result = await BaseDatabase.connection(CommentsDatabase.COMMENTS_POSTS_TABLE).where({ post_id: input, like: 0 }).count()
  
        return result[0]['count(*)']
    }
}