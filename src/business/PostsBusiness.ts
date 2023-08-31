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
import { User, UserDB } from "../models/UserModel";
import { Comments, CommentsDB, CommentsLikeDB } from "../models/CommentModel";
import { CommentPostInputDTO, CommentPostOutputDTO } from "../dtos/commentPost.dto";
import { LikeCommentInputDTO, LikeCommentOutputDTO } from "../dtos/likeComment.dto";
import { CommentDTO, GetPostInfoInputDTO, GetPostInfoOuputDTO } from "../dtos/getPostInfo.dto";

export class PostsBusiness {
    constructor(private postsDatabase: PostsDatabase, private idGenerator: IdGenerator, private tokenManager: TokenManager, private userDatabase: UserDatabase, private likesDatabase: LikesDatabase) { }

    //
    //Get Posts
    //
    public getAllPosts = async (input: GetPostsInputDTO): Promise<GetPostOutputDTO | GetPostOutputDTO[]> => {

        const { auth, id } = input

        const payload = await this.tokenManager.getPayLoad(auth)

        if (!payload || payload === null) {
            throw new BadRequest("Invalid token.")
        }
        
        if (id !== undefined) {
            const [postDB]: PostsDB[] = await this.postsDatabase.getPostsById(id)

            if (!postDB) {
                throw new NotFoundError("Post not found.")
            }

            const post: Post = new Post(
                postDB.id,
                postDB.creator_id,
                postDB.content,
                postDB.comments,
                postDB.likes,
                postDB.dislikes,
                postDB.created_at,
                postDB.updated_at
            )

            const postModel = post.postToDB()

            const [userDB]: UserDB[] = await this.userDatabase.getUsers(postDB.creator_id)

            const user: User = new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at
            )

            const userModel = user.toBusinessModel()

            const output: GetPostOutputDTO = {
                id: postModel.id,
                content: postModel.content,
                comments: postModel.comments,
                likes: postModel.likes - postModel.dislikes,
                createdAt: postModel.created_at,
                uploadedAt: postModel.uploaded_at,
                creator: {
                    id: userModel.id,
                    name: userModel.name
                }
            }

            return output
        } else {
            const postsDB = await this.postsDatabase.getPosts()
    
            const output = []
            for (const post of postsDB) {

                const [user]: UserDB[] = await this.userDatabase.getUsers(post.creator_id)

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
    }

    //
    //Create Post
    //
    public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {

        const { content, token } = input

        const payload = this.tokenManager.getPayLoad(token)
        if (!payload) {
            throw new BadRequest("Token not found.")
        }

        const [user]: UserDB[] = await this.userDatabase.getUsers(payload.id)
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

        const [user]: UserDB[] = await this.userDatabase.getUsersById(payLoad.id)

        if (!user) {
            throw new NotFoundError("User not found.")
        }

        const [post]: PostsDB[] = await this.postsDatabase.getPostsById(postId)

        if (!post) {
            throw new NotFoundError("Post not found.")
        }

        if (user.id !== post.creator_id) {
            throw new BadRequest("Only the post creator can edit it.")
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

        const payLoad = this.tokenManager.getPayLoad(token)
        if (!payLoad) {
            throw new BadRequest("Token invalid.")
        }

        const [user]: UserDB[] = await this.userDatabase.getUsersById(payLoad.id)

        const [post]: PostsDB[] = await this.postsDatabase.getPostsById(postId)



        if (!post) {
            throw new NotFoundError("Post not found.")
        }

        if (user.id !== post.creator_id) {
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
        let likeValue;
        if (like === true) {
            likeValue = 1
        } else if (like === false) {
            likeValue = 0
        }


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
            throw new BadRequest("Creators can't like or dislike their own post.")
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
                output = "You changed your like to a dislike."

            } else if (liked.like === 0 && likePostDB.like === 1) {
                await this.likesDatabase.editLike(likePostDB)
                output = "You changed your dislike to a like."

            }
        } else {
            if (likePostDB.like === 1) {
                output = "You liked this post."

            } else if (likePostDB.like === 0) {
                output = "You disliked this post."

            }
            await this.likesDatabase.likeDislike(likePostDB)
        }

        const likesFromDB = await this.likesDatabase.postLikes(likePostDB.post_id)

        const dislikesFromDB = await this.likesDatabase.postDislikes(likePostDB.post_id)


        await this.postsDatabase.editLikePost(likePostDB.post_id, Number(likesFromDB), Number(dislikesFromDB))

        return output

    }
    
    //
    //get likes
    //
    public getLikes =async (input:any) => {
        const {token, postId} = input
        
        const payload = await this.tokenManager.getPayLoad(token)
        
        if(!payload){
            throw new BadRequest("Invalid token.")
        }
        
        const [user] = await this.userDatabase.getUsersById(payload.id)
        if(!user){
            throw new NotFoundError("User not found.")
        }
        
        const [post] = await this.postsDatabase.getPostsById(postId)
        
        if(!post){
            throw new NotFoundError("Post not found.")
        }
        
        const searchInDb = {
            user_id: user.id,
            post_id: post.id      
        }

        const output = await this.likesDatabase.getLikes(searchInDb)
        return output
        
    }
    //
    //Comment in a post
    //
    public commentPost = async (input: CommentPostInputDTO): Promise<CommentPostOutputDTO> => {
        const { token, postId, comment } = input

        const payLoad: TokenPayLoad | null = await this.tokenManager.getPayLoad(token)

        if (!payLoad) {
            throw new BadRequest("Invalid token.")
        }

        const [user] = await this.userDatabase.getUsersById(payLoad.id)

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

    public getPost = async (input: GetPostInfoInputDTO): Promise<GetPostInfoOuputDTO> => {
        const { token, id } = input

        const payLoad = await this.tokenManager.getPayLoad(token)

        if (!payLoad) {
            throw new BadRequest("Token not valid.")
        }

        const [postDB]: PostsDB[] = await this.postsDatabase.getPostsById(id)

        if (!postDB) {
            throw new NotFoundError("Post not found.")
        }
        const commentsDB: CommentsDB[] = await this.postsDatabase.getCommentsByPostId(id)
    
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
         const [creator]: UserDB[] = await this.userDatabase.getUsersById(postDB.creator_id)
       
         const output: GetPostInfoOuputDTO = {
            
            postId: postDB.id,
            postCreatorId: creator.id,
            postCreatorName: creator.name,
            postContent: postDB.content,
            postLikes: postDB.likes - postDB.dislikes,
            postCreatedAt: postDB.created_at,
            postUpdatedAt: postDB.updated_at,
            postComments: comments
        }

        return output
    }
    //
    //Get comments likes
    //
    
    public getCommentsLikes  =async (input:any) => {
        const {token, commentId} = input
        
        const payload = await this.tokenManager.getPayLoad(token)
        
        if(!payload){
            throw new BadRequest("Invalid token.")
        }
        
        const [user] = await this.userDatabase.getUsersById(payload.id)
        if(!user){
            throw new NotFoundError("User not found.")
        }
        
        const [comment] = await this.postsDatabase.getCommentsById(commentId)
        
        if(!comment){
            throw new NotFoundError("Comment not found.")
        }
        const searchInDb = {
            user_id: user.id,
            comment_id: comment.id     
        }

        
        const output = await this.postsDatabase.getCommentLikesByCommentId(searchInDb)

        return output
        
    }
    //
    //Like Comment
    //
    public likeComment = async (input: LikeCommentInputDTO): Promise<LikeCommentOutputDTO> => {
        const { token, postId, commentId, like } = input

        const payLoad: TokenPayLoad | null = await this.tokenManager.getPayLoad(token)
        if (!payLoad) {
            throw new BadRequest("Invalid token.")
        }

        let output;
        let likeValue = like ? 1 : 0



        const [userDB] = await this.userDatabase.getUsersById(payLoad.id)

        if (!userDB) {
            throw new NotFoundError("User not found.")
        }
        const [postDB] = await this.postsDatabase.getPostsById(postId)
        if (!postDB) {
            throw new NotFoundError("Post not found.")
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
                output = "You removed your dislike."

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


        const commentsLikesFromDB = await this.postsDatabase.getCommentLikes(commentsLikeDB.comment_id)

        const commentsDislikesFromDB = await this.postsDatabase.getCommentDislikes(commentsLikeDB.comment_id)


        await this.postsDatabase.editCommentPost(commentsLikeDB.comment_id, Number(commentsLikesFromDB), Number(commentsDislikesFromDB))
        return output

    }

}

