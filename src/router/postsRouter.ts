import express from "express"
import { PostsController } from "../controllers/PostsController"
import { PostsBusiness } from "../business/PostsBusiness"
import { PostsDatabase } from "../database/PostsDatabase"
import { IdGenerator } from "../services/idGenerator"
import { TokenManager } from "../services/TokenManager"
import { UserDatabase } from "../database/UserDatabase"
import { LikesDatabase } from "../database/LikesDabatase"


export const postsRouter = express.Router()

const postsController = new PostsController(new PostsBusiness(new PostsDatabase(), new IdGenerator(), new TokenManager(), new UserDatabase(), new LikesDatabase()))

postsRouter.get("/", postsController.getPosts)
postsRouter.post("/", postsController.createPost)
postsRouter.put("/:id", postsController.editPost)
postsRouter.delete("/:id", postsController.deletePost)
postsRouter.post("/:id/like", postsController.likePost)