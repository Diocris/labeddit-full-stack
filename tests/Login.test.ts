import { UserBusiness } from "../src/business/UserBusiness"
import { LoginSchema } from "../src/dtos/login.dto"
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

})