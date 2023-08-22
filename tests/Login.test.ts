import { UserBusiness } from "../src/business/UserBusiness"
import { LoginSchema } from "../src/dtos/login.dto"
import { BadRequest } from "../src/errors/BadRequestError"
import { NotFoundError } from "../src/errors/NotFoundError"
import { HashManagerMock } from "./mocks/HashManagerMock"
import { TokenManagerMock } from "./mocks/TokenManagerMock"
import { UserDatabaseMock } from "./mocks/UserDatabaseMock"
import { IdGeneratorMock } from "./mocks/idGeneratorMock"

describe("Testing User Login", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("Shoud return a token", async () => {
        const input = LoginSchema.parse({
            email: "testuser@email.com",
            password: "user01",
        })

        const output = await userBusiness.login(input)


        expect(output).toEqual({
            message: "Logged in.",
            token: "token-mock-user"
        })

    })

    test("Shoud return a NotFoundError for user not found.", async () => {
        expect.assertions(2)
        try {
            const input = LoginSchema.parse({
                email: "testerror@email.com",
                password: "user01",
            })

            await userBusiness.login(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Email not found.")
            }
        }
    })

    test("Shoud return a BadRequestError for incorrect password or email.", async () => {
        expect.assertions(2)
        try {
            const input = LoginSchema.parse({
                email: "testuser@email.com",
                password: "hash-mock-error",
            })

            await userBusiness.login(input)
        } catch (error) {
            if (error instanceof BadRequest) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Incorrect email or password.")
            }
        }
    })

})