
import { PostsBusiness } from "../src/business/PostsBusiness"
import { GetPostInfoSchema } from "../src/dtos/getPostInfo.dto"
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


    test('Test get full post.', async () => {

        const input = GetPostInfoSchema.parse({
            token: "token-mock-user",
            id: "id-mock-post02"
        })

        const output = await postBusiness.getPost(input)

        expect(output).toEqual({
            postId: "id-mock-post02",
            postCreatorId: "id-mock-admin",
            postCreatorName: "Test Admin",
            postContent: "Content mock second post.",
            postLikes: 1,
            postCreatedAt: expect.any(String),
            postUpdatedAt: expect.any(String),
            postComments: [
                {
                    commentId: "id-mock-comment01",
                    commentUserId: "id-mock-user",
                    commentUserName: "Test User",
                    commentContent: "Content mock first comment second post.",
                    commentLikes: -1,
                    commentCreatedAt: expect.any(String),
                    commentUpdatedAt: expect.any(String)
                }, {
                    commentId: "id-mock-comment02",
                    commentUserId: "id-mock-user",
                    commentUserName: "Test User",
                    commentContent: "Content mock second comment second post.",
                    commentLikes: 0,
                    commentCreatedAt: expect.any(String),
                    commentUpdatedAt: expect.any(String)
                }
            ]
        })
    })


    test('Test BadRequest with invalid token.', async () => {
        expect.assertions(2)
        try {
            const input = GetPostInfoSchema.parse({
                token: "token-mock-error",
                id: "id-mock-post02"
            })

            await postBusiness.getPost(input)

        } catch (error) {
            if (error instanceof BadRequest) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Token not valid.")
            }
        }
    })



    test('Test NotFound post.', async () => {
        expect.assertions(2)
        try {
            const input = GetPostInfoSchema.parse({
                token: "token-mock-user",
                id: "id-mock-post"
            })

            await postBusiness.getPost(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Post not found.")
            }
        }
    })

   
})
