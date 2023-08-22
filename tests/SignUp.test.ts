import { UserBusiness } from "../src/business/UserBusiness"
import { SignupSchema } from "../src/dtos/signup.dto"
import { BadRequest } from "../src/errors/BadRequestError"
import { USER_ROLES } from "../src/models/UserModel"
import { HashManagerMock } from "../tests/mocks/HashManagerMock"
import { IdGeneratorMock } from "../tests/mocks/idGeneratorMock"
import { TokenManagerMock } from "../tests/mocks/TokenManagerMock"
import { UserDatabaseMock } from "./mocks/UserDatabaseMock"

describe("Testando signup", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("Should return a token when register.", async () => {
        const input = SignupSchema.parse({
            name: "New Test User",
            email: "newtestuser@email.com",
            password: "newtestuser01"
        })

        const output = await userBusiness.signUp(input)

        expect(output).toEqual({
            message: "Successfully registered user.",
            token: "token-mock"
        })
    })

    test('Should return a BadRequestError for duplicate email in database.', async () => {
        expect.assertions(2)
        try {
            const input = SignupSchema.parse({
                name: "Test Error",
                email: "testuser@email.com",
                password: "emailforerror",
                role: USER_ROLES.NORMAL
            })

            await userBusiness.signUp(input)

        } catch (error) {
            if (error instanceof BadRequest) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("User already registered, try another one.")
            }
        }

    })
})