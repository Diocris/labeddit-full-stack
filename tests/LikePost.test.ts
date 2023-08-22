import { PostsBusiness } from "../src/business/PostsBusiness"
import { LikeDislikeSchema } from "../src/dtos/likeDislikePost.dto"
import { BadRequest } from "../src/errors/BadRequestError"
import { NotFoundError } from "../src/errors/NotFoundError"
import { LikesDatabaseMock } from "./mocks/LikesDatabaseMock"
import { PostsDatabaseMock } from "./mocks/PostDatabaseMock"
import { TokenManagerMock } from "./mocks/TokenManagerMock"
import { UserDatabaseMock } from "./mocks/UserDatabaseMock"
import { IdGeneratorMock } from "./mocks/idGeneratorMock"

describe('Testing Post Business', () => {

    const postBusiness = new PostsBusiness(
        new PostsDatabaseMock,
        new IdGeneratorMock,
        new TokenManagerMock,
        new UserDatabaseMock,
        new LikesDatabaseMock
    )

    test('Test like.', async () => {
        const input = LikeDislikeSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post03",
            like: true
        })

        const output = await postBusiness.likePost(input)

        expect(output).toBe("You liked this post.")
    })

    test('Test dislike.', async () => {
        const input = LikeDislikeSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post03",
            like: false
        })

        const output = await postBusiness.likePost(input)

        expect(output).toBe("You disliked this post.")
    })

    test('Testing Invalid token', async () => {

        try {
            const input = LikeDislikeSchema.parse({
                token: "token-mock-admin",
                postId: "id-mock-post01",
                like: true
            })

            await postBusiness.likePost(input)

        } catch (error) {
            if (error instanceof BadRequest) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Invalid token.")
            }
        }


    })

    test('Testing if changes dislike to like.', async () => {
        const input = LikeDislikeSchema.parse({
            token: "token-mock-admin",
            postId: "id-mock-post01",
            like: true
        })


        const output = await postBusiness.likePost(input)

        expect(output).toBe("You removed your like.")
    })

    test('Testing if changes like to dislike.', async () => {
        const input = LikeDislikeSchema.parse({
            token: "token-mock-admin",
            postId: "id-mock-post01",
            like: false
        })


        const output = await postBusiness.likePost(input)

        expect(output).toBe("You changed your like to a dislike.")
    })

    test('Testing if it likes a post.', async () => {
        const input = LikeDislikeSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post02",
            like: true
        })


        const output = await postBusiness.likePost(input)

        expect(output).toBe("You changed your dislike to a like.")
    })
    test('Testing if it dislikes a post.', async () => {
        const input = LikeDislikeSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post02",
            like: false
        })


        const output = await postBusiness.likePost(input)

        expect(output).toBe("You removed your dislike.")
    })

    test('Test BadRequest with invalid token.', async () => {
        expect.assertions(2)
        try {
            const input = LikeDislikeSchema.parse({
                token: "token-mock-error",
                postId: "id-mock-post01",
                like: true
            })

            await postBusiness.likePost(input)

        } catch (error) {
            if (error instanceof BadRequest) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Invalid token.")
            }
        }
    })
    test('Test NotFoundError for user..', async () => {
        expect.assertions(2)
        try {
            const input = LikeDislikeSchema.parse({
                token: "token-mock-test-error",
                postId: "id-mock-post01",
                like: true
            })

            await postBusiness.likePost(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("User not found.")
            }
        }
    })

    test('Test NotFoundError for post.', async () => {
        expect.assertions(2)
        try {
            const input = LikeDislikeSchema.parse({
                token: "token-mock-user",
                postId: "id-mock-post04",
                like: true
            })

            await postBusiness.likePost(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Post not found.")
            }
        }
    })

    test('Test if creator is trying to like them own post.', async () => {
        expect.assertions(2)
        try {
            const input = LikeDislikeSchema.parse({
                token: "token-mock-user",
                postId: "id-mock-post01",
                like: true
            })

            await postBusiness.likePost(input)

        } catch (error) {
            if (error instanceof BadRequest) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Creators can't like them own post.")
            }
        }
    })


})