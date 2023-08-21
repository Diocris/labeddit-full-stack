import { UserBusiness } from "../src/business/UserBusiness"
import { SignupSchema } from "../src/dtos/signup.dto"
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
})