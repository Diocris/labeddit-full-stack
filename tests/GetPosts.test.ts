import { PostsBusiness } from "../src/business/PostsBusiness"
import { getPostsSchema } from "../src/dtos/getPosts.dto"
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


    test('Test get posts by ID.', async () => {
        const input = getPostsSchema.parse({
            auth: "token-mock-admin",
            id: "id-mock-post01"
        })

        const output = await postBusiness.getAllPosts(input)

        expect(output).toEqual({
            id: "id-mock-post01",
            content: "Content mock first post.",
            comments: Number(0),
            likes: Number(0),
            createdAt: expect.any(String),
            uploadedAt: expect.any(String),
            creator: {
                id: "id-mock-user",
                name: "Test User"
            }
        })
    })


    test('Test get all posts.', async () => {
        const input = getPostsSchema.parse({
            auth: "token-mock-admin",

        })

        const output = await postBusiness.getAllPosts(input)
        expect(output).toHaveLength(3)
        expect(output).toEqual([{
            id: "id-mock-post01",
            content: "Content mock first post.",
            comments: Number(0),
            likes: Number(0),
            createdAt: expect.any(String),
            uploadedAt: expect.any(String),
            creator: {
                id: "id-mock-user",
                name: "Test User"
            }
        }, {
            id: "id-mock-post02",
            content: "Content mock second post.",
            comments: Number(2),
            likes: Number(1),
            createdAt: expect.any(String),
            uploadedAt: expect.any(String),
            creator: {
                id: "id-mock-admin",
                name: "Test Admin"
            }
        },
        {
            id: "id-mock-post03",
            content: "Content mock third post.",
            comments: Number(0),
            likes: Number(0),
            createdAt: expect.any(String),
            uploadedAt: expect.any(String),
            creator: {
                id: "id-mock-admin",
                name: "Test Admin"
            }
        }])
    })

    test('Test BadRequest with invalid token.', async () => {
        expect.assertions(2)
        try {
            const input = getPostsSchema.parse({
                auth: "token-mock-error",
            })

            await postBusiness.getAllPosts(input)

        } catch (error) {
            if (error instanceof BadRequest) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Invalid token.")
            }
        }
    })


    test('Test NotFoundError with post not found.', async () => {
        expect.assertions(2)
        try {
            const input = getPostsSchema.parse({
                auth: "token-mock-user",
                id: "id-mock-error"
            })

            await postBusiness.getAllPosts(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Post not found.")
            }
        }
    })

})
