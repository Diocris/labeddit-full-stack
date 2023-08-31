import express from "express"
import { PostsController } from "../controller/PostsController"
import { PostsBusiness } from "../business/PostsBusiness"
import { PostsDatabase } from "../database/PostDatabase"
import { IdGenerator } from "../services/idGenerator"
import { TokenManager } from "../services/TokenManager"
import { UserDatabase } from "../database/UserDatabase"
import { LikesDatabase } from "../database/LikesDatabase"


export const postsRouter = express.Router()

const postsController = new PostsController(new PostsBusiness(new PostsDatabase(), new IdGenerator(), new TokenManager(), new UserDatabase(), new LikesDatabase()))

postsRouter.get("/", postsController.getAllPosts)
postsRouter.post("/:id/comments/:commentid", postsController.likeComment)
postsRouter.post("/:id/comments", postsController.commentPost)
postsRouter.get("/:id/comments", postsController.getPost)
postsRouter.get("/:id/comments/:commentid", postsController.getCommentsLike)
postsRouter.post("/", postsController.createPost)
postsRouter.put("/:id", postsController.editPost)
postsRouter.delete("/:id", postsController.deletePost)
postsRouter.post("/:id/like", postsController.likePost)
postsRouter.get("/:id/like", postsController.getLikes)



