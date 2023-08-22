
import { PostsBusiness } from "../src/business/PostsBusiness"
import { GetPostInfoSchema } from "../src/dtos/getPostInfo.dto"
import { LikeCommentInputSchema } from "../src/dtos/likeComment.dto"
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

    test('Must like a comment.', async () => {

        const input = LikeCommentInputSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post02",
            commentId: "id-mock-comment01",
            like: true
        })

        const output = await postBusiness.likeComment(input)

        expect(output).toBe("You liked the comment.")
    })

    test('Must like a comment.', async () => {

        const input = LikeCommentInputSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post02",
            commentId: "id-mock-comment01",
            like: false
        })

        const output = await postBusiness.likeComment(input)

        expect(output).toBe("You disliked the comment.")
    })

    test('Testing BadRequest Invalid Token.', async () => {
        expect.assertions(2)
        try {
            const input = LikeCommentInputSchema.parse({
                token: "token-mock-error",
                postId: "id-mock-post02",
                commentId: "id-mock-comment01",
                like: true
            })

            await postBusiness.likeComment(input)

        } catch (error) {
            if (error instanceof BadRequest) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Invalid token.")
            }
        }
    })


    test('Testing NotFoundError User not found.', async () => {
        expect.assertions(2)
        try {
            const input = LikeCommentInputSchema.parse({
                token: "token-mock-test-error",
                postId: "id-mock-post02",
                commentId: "id-mock-comment01",
                like: true
            })


            await postBusiness.likeComment(input)


        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("User not found.")
            }
        }
    })


    test('Testing NotFoundError Post not found.', async () => {
        expect.assertions(2)
        try {
            const input = LikeCommentInputSchema.parse({
                token: "token-mock-user",
                postId: "id-mock-error",
                commentId: "id-mock-comment01",
                like: true
            })


            await postBusiness.likeComment(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Post not found.")
            }
        }

    })

    test('Testing NotFoundError Comment not found.', async () => {
        expect.assertions(2)
        try {
            const input = LikeCommentInputSchema.parse({
                token: "token-mock-user",
                postId: "id-mock-post02",
                commentId: "id-mock-comment03",
                like: true
            })


            await postBusiness.likeComment(input)


        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Comment not found.")
            }
        }

    })

    test('Testing Like a comment.', async () => {

        const input = LikeCommentInputSchema.parse({
            token: "token-mock-admin",
            postId: "id-mock-post02",
            commentId: "id-mock-comment01",
            like: true
        })


        const output = await postBusiness.likeComment(input)
        expect(output).toBe("You liked the comment.")

    })


    test('Testing Like a comment.', async () => {

        const input = LikeCommentInputSchema.parse({
            token: "token-mock-admin",
            postId: "id-mock-post02",
            commentId: "id-mock-comment01",
            like: false
        })


        const output = await postBusiness.likeComment(input)
        expect(output).toBe("You removed your dislike.")

    })

    test('Testing Remove Dislike..', async () => {

        const input = LikeCommentInputSchema.parse({
            token: "token-mock-admin",
            postId: "id-mock-post02",
            commentId: "id-mock-comment02",
            like: true
        })


        const output = await postBusiness.likeComment(input)
        expect(output).toBe("You removed your like.")

    })
    test('Testing Remove Dislike..', async () => {

        const input = LikeCommentInputSchema.parse({
            token: "token-mock-admin",
            postId: "id-mock-post02",
            commentId: "id-mock-comment02",
            like: false
        })


        const output = await postBusiness.likeComment(input)
        expect(output).toBe("You disliked the comment.")

    })


})