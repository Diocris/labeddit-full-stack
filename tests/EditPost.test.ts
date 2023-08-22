import { PostsBusiness } from "../src/business/PostsBusiness"
import { CreatePostSchema } from "../src/dtos/createPost.dto"
import { EditPostSchema } from "../src/dtos/editPost.dto"
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

    test('', async () => {
        const input = EditPostSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post01",
            content: "Id edited post01."
        })

        const output = await postBusiness.editPost(input)

        expect(output).toEqual({ "message": "Post edited." })
    })

    test('Test BadRequest', async () => {
        expect.assertions(2)
        try {
            const input = EditPostSchema.parse({
                token: "token-mock-error",
                postId: "id-mock-post01",
                content: "Id edited post01."
            })

            await postBusiness.editPost(input)
        } catch (error) {
            if (error instanceof BadRequest) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Token not found.")
            }
        }
    })


    test('Test User not found.', async () => {
        expect.assertions(2)
        try {
            const input = EditPostSchema.parse({
                token: "token-mock-test-error",
                postId: "id-mock-post01",
                content: "Id edited post01."
            })

            await postBusiness.editPost(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("User not found.")

            }
        }
    })


    test('Test BadRequest', async () => {
        expect.assertions(2)
        try {
            const input = EditPostSchema.parse({
                token: "token-mock-admin",
                postId: "id-mock-post01",
                content: "Id edited post01."
            })

            await postBusiness.editPost(input)

        } catch (error) {
            if (error instanceof BadRequest) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Only the post creator can edit it.")

            }
        }
    })


    test('Test NotFound', async () => {
        expect.assertions(2)
        try {
            const input = EditPostSchema.parse({
                token: "token-mock-user",
                postId: "id-mock-postError",
                content: "Id edited post01."
            })

            await postBusiness.editPost(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Post not found.")
            }
        }
    })
})