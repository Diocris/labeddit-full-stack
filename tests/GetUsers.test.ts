import { UserBusiness } from "../src/business/UserBusiness"
import { GetUsersSchema } from "../src/dtos/getUsers.dto"
import { BadRequest } from "../src/errors/BadRequestError"
import { NotFoundError } from "../src/errors/NotFoundError"
import { USER_ROLES } from "../src/models/UserModel"
import { HashManagerMock } from "./mocks/HashManagerMock"
import { TokenManagerMock } from "./mocks/TokenManagerMock"
import { UserDatabaseMock } from "./mocks/UserDatabaseMock"
import { IdGeneratorMock } from "./mocks/idGeneratorMock"

describe("Testing Get users", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )


    test("Should return an user array.", async () => {
        const input = GetUsersSchema.parse({
            token: "token-mock-admin"
        })

        const output = await userBusiness.getUsers(input)
        expect(output).toHaveLength(2)
        expect(output).toEqual([{
            id: "id-mock-admin",
            name: "Test Admin",
            email: "testadmin@email.com",
            role: USER_ROLES.ADMIN,
            createdAt: expect.any(String)
        }, {
            id: "id-mock-user",
            name: "Test User",
            email: "testuser@email.com",
            role: USER_ROLES.NORMAL,
            createdAt: expect.any(String)
        },
        ])
    })

    test('Should return an BadRequest.', async () => {
        expect.assertions(2)
        try {
            const input = GetUsersSchema.parse({
                token: "token-mock-error"
            })
            await userBusiness.getUsers(input)
        } catch (error: any) {
            if (error instanceof BadRequest) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Token inválido.")
            }
        }
    })

    test('Should return a NotFoundError', async () => {
        expect.assertions(2)
        try {
            const input = GetUsersSchema.parse({
                q: "id-mock-error",
                token: "token-mock-admin"
            })

            await userBusiness.getUsers(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("User not found.")
            }
        }
    })

})