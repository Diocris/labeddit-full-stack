import { PostsBusiness } from "../src/business/PostsBusiness"
import { CreatePostSchema } from "../src/dtos/createPost.dto"
import { DeletePostSchema } from "../src/dtos/deletePost.dto"
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

    test('Test delete post.', async () => {
        const input = DeletePostSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post01"
        })

        const output = await postBusiness.deletePost(input)

        expect(output).toEqual({
            message: "Post deleted."
        })
    })

    test('Token invalid', async () => {
        expect.assertions(2)
        try {
            const input = DeletePostSchema.parse({
                token: "token-mock-error",
                postId: "id-mock-post01",
            })

            await postBusiness.deletePost(input)

        } catch (error) {
            if (error instanceof BadRequest) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Token invalid.")
            }
        }
    })

    test('Null id info post.', async () => {
        expect.assertions(2)
        try {
            const input = DeletePostSchema.parse({
                token: "token-mock-user",
                postId: "id-mock-post",
            })

            await postBusiness.deletePost(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Post not found.")
            }
        }
    })


    test('Null id info post.', async () => {
        expect.assertions(2)
        try {
            const input = DeletePostSchema.parse({
                token: "token-mock-user",
                postId: "id-mock-post02",
            })

            await postBusiness.deletePost(input)

        } catch (error) {
            if (error instanceof BadRequest) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Only the post creator can delete it.")
            }
        }
    })
})

