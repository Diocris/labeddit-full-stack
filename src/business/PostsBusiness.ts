import { PostsDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/deletePost.dto";
import { editPostInputDTO, editPostOutputDTO } from "../dtos/editPost.dto";
import { GetPostOutputDTO, GetPostsInputDTO } from "../dtos/getPosts.dto";
import { BadRequest } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { TokenManager, TokenPayLoad } from "../services/TokenManager";
import { IdGenerator } from "../services/idGenerator";
import { LikesDB, Post, PostsDB, PostsModel } from "../models/PostModel";
import { LikesDatabase } from "../database/LikesDatabase";
import { LikeDislikeInputDTO, LikeDislikeOutputDTO } from "../dtos/likeDislikePost.dto";
import { TokenPayload, UserDB } from "../models/UserModel";
import { Comments, CommentsDB, CommentsLikeDB } from "../models/CommentModel";
import { CommentPostInputDTO, CommentPostOutputDTO } from "../dtos/commentPost.dto";
import { LikeCommentInputDTO, LikeCommentOutputDTO } from "../dtos/likeComment.dto";
import { CommentDTO, GetPostInfoOuputDTO } from "../dtos/getPostInfo.dto";

export class PostsBusiness {
    constructor(private postsDatabase: PostsDatabase, private idGenerator: IdGenerator, private tokenManager: TokenManager, private userDatabase: UserDatabase, private likesDatabase: LikesDatabase) { }

    //
    //Get Posts
    //
    public getAllPosts = async (input: GetPostsInputDTO): Promise<GetPostOutputDTO[]> => {

        const { auth, id } = input

        if (!auth) {
            throw new BadRequest("Authorization required.")
        }

        const postsDatabase: PostsDB[] = await this.postsDatabase.getPosts(id)

        const output = []

        for (const post of postsDatabase) {

            const [user] = await this.userDatabase.getUsers(post.creator_id)

            const postDB: GetPostOutputDTO = {
                id: post.id,
                content: post.content,
                comments: post.comments,
                likes: post.likes - post.dislikes,
                createdAt: post.created_at,
                uploadedAt: post.updated_at,
                creator: {
                    id: await user.id,
                    name: await user.name
                }

            }

            output.push(postDB)
        }

        return output

    }

    //
    //Create Post
    //
    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {

        const { content, token } = input

        const userToken = this.tokenManager.getPayLoad(token)
        if (!userToken) {
            throw new BadRequest("Token not found.")
        }
        const [user]: UserDB[] = await this.userDatabase.getUsers(userToken?.id)
        if (!user) {
            throw new NotFoundError("User not found, authorization must be wrong, check it again.")
        }
        const postId: string = this.idGenerator.generate()

        const newPost: PostsDB = {
            id: postId,
            creator_id: user?.id,
            content: content,
            comments: 0,
            likes: 0,
            dislikes: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }

        await this.postsDatabase.createNewPost(newPost)

        const output: CreatePostOutputDTO = {
            id: newPost.id,
            content: newPost.content,
            comments: newPost.comments,
            likes: newPost.likes,
            dislikes: newPost.dislikes,
            createdAt: newPost.created_at,
            updatedAt: newPost.updated_at,
            creator: {
                id: newPost.creator_id,
                name: user?.name,
            }
        }

        return output
    }

    //
    //Edit Post
    //
    public editPost = async (input: editPostInputDTO): Promise<editPostOutputDTO> => {

        const { token, postId, content } = input

        const payLoad: TokenPayLoad | null = this.tokenManager.getPayLoad(token)
        if (!payLoad) {
            throw new BadRequest("Token not found.")
        }

        const [user]: UserDB[] = await this.userDatabase.getUsers(payLoad?.id)

        if (!user) {
            throw new NotFoundError("User not found.")
        }

        if (user.id !== payLoad?.id) {
            throw new BadRequest("Only the post creator can edit it.")
        }

        const [post]: PostsDB[] = await this.postsDatabase.getPosts(postId)

        if (!post) {
            throw new NotFoundError("Post not found.")
        }

        const editedPostModel: Post = new Post(
            post.id, post.creator_id, content, post.comments, post.likes, post.dislikes, post.created_at, new Date().toISOString()
        )

        const editedPostDB: PostsDB = {
            id: editedPostModel.getId(),
            creator_id: editedPostModel.getCreatorId(),
            content: editedPostModel.getContent(),
            comments: editedPostModel.getComments(),
            likes: editedPostModel.getLikes(),
            dislikes: editedPostModel.getDislikes(),
            created_at: editedPostModel.getCreatedAt(),
            updated_at: editedPostModel.getUploadedAt()
        }

        await this.postsDatabase.editPost(editedPostDB)

        const output: editPostOutputDTO = {
            message: `Post edited.`
        }

        return output
    }

    //
    //Delete Post
    //
    public deletePost = async (input: DeletePostInputDTO): Promise<DeletePostOutputDTO> => {
        const { token, postId } = input

        if (!token) {
            throw new BadRequest("Token invalid.")
        }

        if (postId === ":id" || !postId) {
            throw new BadRequest("Post ID is expected.")
        }

        const creator: TokenPayLoad | null = this.tokenManager.getPayLoad(token)

        const [post]: PostsDB[] = await this.postsDatabase.getPosts(postId)



        if (!post) {
            throw new NotFoundError("Post not found.")
        }

        if (creator?.id !== post.creator_id) {
            throw new BadRequest("Only the post creator can delete it.")
        }

        await this.postsDatabase.deletePost(post.id)

        const output: DeletePostOutputDTO = {
            message: "Post deleted."
        }

        return output

    }

    //
    //Like / Dislike Post
    //
    public likePost = async (input: LikeDislikeInputDTO): Promise<any> => {
        const { token, postId, like } = input

        let output;
        let likeValue = like ? 1 : 0


        const payload: TokenPayLoad | null = await this.tokenManager.getPayLoad(token)

        if (!payload) {
            throw new BadRequest("Invalid token.")
        }

        const [userDB]: UserDB[] = await this.userDatabase.getUsers(payload.id)

        if (!userDB) {
            throw new NotFoundError("User not found.")
        }

        const [post]: PostsDB[] = await this.postsDatabase.getPosts(postId)

        if (!post) {
            throw new NotFoundError("Post not found.")
        }

        const likePostDB: LikesDB = {
            user_id: userDB.id,
            post_id: post.id,
            like: Number(likeValue)
        }
        if (post.creator_id === likePostDB.user_id) {
            throw new BadRequest("Creators can't like them own post.")
        }


        const [liked]: LikesDB[] = await this.likesDatabase.getLikes(likePostDB)

        if (liked) {
            if (liked.like === 1 && likePostDB.like === 1) {

                await this.likesDatabase.deleteLike(likePostDB)
                output = "You removed your like."

            } else if (liked.like === 0 && likePostDB.like === 0) {

                await this.likesDatabase.deleteLike(likePostDB)
                output = "You removed your dislike."

            } else if (liked.like === 1 && likePostDB.like === 0) {

                await this.likesDatabase.editLike(likePostDB)
                output = "You change your like to a dislike."

            } else if (liked.like === 0 && likePostDB.like === 1) {

                await this.likesDatabase.editLike(likePostDB)
                output = "You change your like to a like."

            }
        } else {
            if (likePostDB.like === 1) {

                output = "You liked this post."

            } else if (likePostDB.like === 0) {

                output = "You disliked this post."

            }
            await this.likesDatabase.likeDislike(likePostDB)
        }

        const [likesFromDB] = await this.likesDatabase.postLikes(likePostDB.post_id)
        const newLikes = Number(likesFromDB['count(*)'])
        const [dislikesFromDB] = await this.likesDatabase.postDislikes(likePostDB.post_id)
        const newDislikes = Number(dislikesFromDB['count(*)'])

        await this.postsDatabase.editLikePost(likePostDB.post_id, newLikes, newDislikes)

        return output

    }

    //
    //Comment in a post
    //
    public commentPost = async (input: CommentPostInputDTO): Promise<CommentPostOutputDTO> => {
        const { token, postId, comment } = input

        const user = this.tokenManager.getPayLoad(token)

        if (!user) {
            throw new NotFoundError("User not found.")
        }

        const [post]: PostsDB[] = await this.postsDatabase.getPosts(postId)

        if (!post) {
            throw new NotFoundError("Post not found.")
        }

        const postModel: Post = new Post(
            post.id,
            post.creator_id,
            post.content,
            post.comments + 1,
            post.likes,
            post.dislikes,
            post.created_at,
            post.updated_at
        )

        const editedPostDB: PostsDB = {
            id: postModel.getId(),
            creator_id: postModel.getCreatorId(),
            content: postModel.getContent(),
            comments: postModel.getComments(),
            likes: postModel.getLikes(),
            dislikes: postModel.getDislikes(),
            created_at: postModel.getCreatedAt(),
            updated_at: postModel.getUploadedAt()
        }

        const newComment: Comments = new Comments(
            this.idGenerator.generate(),
            user.id,
            post.id,
            comment,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString()
        )

        const newCommentDB: CommentsDB = {
            id: newComment.getId(),
            user_id: newComment.getUserId(),
            post_id: newComment.getPostId(),
            content: newComment.getContent(),
            likes: newComment.getLikes(),
            dislikes: newComment.getDislikes(),
            created_at: newComment.getCreatedAt(),
            updated_at: newComment.getUploadedAt()
        }


        await this.postsDatabase.commentPost(newCommentDB)
        await this.postsDatabase.editPost(editedPostDB)



        const output: CommentPostOutputDTO = {
            message: `Commented in this post`
        }
        return output

    }

    //Get full post with comments

    public getPost = async (input: any) => {
        const { token, postId } = input

        if (!token) {
            throw new BadRequest("Token not valid.")
        }

        const [postDB]: PostsDB[] = await this.postsDatabase.getPosts(postId)

        const commentsDB: CommentsDB[] = await this.postsDatabase.getCommentsByPostId(postId)

        let comments = [];

        for (const comment of commentsDB) {

            const [user]: UserDB[] = await this.userDatabase.getUsers(comment.user_id)


            const commentInfo: CommentDTO = {
                commentId: comment.id,
                commentUserId: comment.user_id,
                commentUserName: user.name,
                commentContent: comment.content,
                commentLikes: comment.likes - comment.dislikes,
                commentCreatedAt: comment.created_at,
                commentUpdatedAt: comment.updated_at,
            }

            comments.push(commentInfo)
        }

        const output: GetPostInfoOuputDTO = {
            postId: postDB.id,
            postCreator: postDB.creator_id,
            postContent: postDB.content,
            postLikes: postDB.likes - postDB.dislikes,
            postCreatedAt: postDB.created_at,
            postUpdatedAt: postDB.updated_at,
            postComments: comments
        }

        return output
    }

    //
    //Like Comment
    //
    public likeComment = async (input: LikeCommentInputDTO): Promise<LikeCommentOutputDTO> => {
        const { token, postId, commentId, like } = input

        if (!token) {
            throw new BadRequest("Token invalid.")
        }

        let output;
        let likeValue = like ? 1 : 0


        const payload = await this.tokenManager.getPayLoad(token)

        if (!payload) {
            throw new NotFoundError("User not found")
        }
        const [userDB] = await this.userDatabase.getUsers(payload.id)
        if (!userDB) {
            throw new NotFoundError("User not found")
        }
        const [postDB] = await this.postsDatabase.getPosts(postId)
        if (!postDB) {
            throw new BadRequest("Post not found.")
        }
        const [comment] = await this.postsDatabase.getCommentsById(commentId)
        if (!comment) {
            throw new NotFoundError("Comment not found.")
        }




        const commentsLikeDB: CommentsLikeDB = {
            user_id: userDB.id,
            comment_id: comment.id,
            like: Number(likeValue)
        }

        const [commentLike]: CommentsLikeDB[] = await this.postsDatabase.getCommentLikesByCommentId(commentsLikeDB)

        if (commentLike) {

            if (commentLike.like === 1 && likeValue === 1) {

                await this.postsDatabase.deleteLike(commentsLikeDB)
                output = "You removed your like."

            } else if (commentLike.like === 0 && likeValue === 0) {

                await this.postsDatabase.deleteLike(commentsLikeDB)
                return output = "You removed your dislike."

            } else if (commentLike.like === 1 && commentsLikeDB.like === 0) {

                await this.postsDatabase.editCommentLike(commentsLikeDB)
                output = "You disliked the comment."

            } else if (commentLike.like === 0 && commentsLikeDB.like === 1) {
                await this.postsDatabase.editCommentLike(commentsLikeDB)
                output = "You liked the comment."

            }


        } else {
            if (commentsLikeDB.like === 1) {

                output = "You liked the comment."

            } else if (commentsLikeDB.like === 0) {

                output = "You disliked the comment."

            }

            await this.postsDatabase.likeComment(commentsLikeDB)
        }


        const [commentsLikesFromDB] = await this.postsDatabase.getCommentLikes(commentsLikeDB.comment_id)
        const newCommentsLikes = Number(commentsLikesFromDB['count(*)'])
        const [commentsDislikesFromDB] = await this.postsDatabase.getCommentDislikes(commentsLikeDB.comment_id)
        const newCommentsDislikes = Number(commentsDislikesFromDB['count(*)'])

        await this.postsDatabase.editCommentPost(commentsLikeDB.comment_id, newCommentsLikes, newCommentsDislikes)
        return output

    }

}

