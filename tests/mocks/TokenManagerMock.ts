import { TokenPayload, USER_ROLES } from '../../src/models/UserModel'

export class TokenManagerMock {
    public createToken = (payload: TokenPayload): string => {
        if (payload.id === "id-mock") {
            // signup de nova conta
            return "token-mock"

        } else if (payload.id === "id-mock-admin") {
            // login de fulano (conta normal)
            return "token-mock-admin"

        } else {
            // login de astrodev (conta admin)
            return "token-mock-user"
        }
    }

    public getPayLoad = (token: string): TokenPayload | null => {
        if (token === "token-mock-admin") {
            return {
                id: "id-mock-admin",
                name: "Test Admin",
                role: USER_ROLES.ADMIN
            }

        } else if (token === "token-mock-user") {
            return {
                id: "id-mock-user",
                name: "Test User",
                role: USER_ROLES.NORMAL
            }

        } else if (token === "token-mock-test-error") {
            return {
                id: "id-mock-test-error",
                name: "Test Error",
                role: USER_ROLES.NORMAL
            }
        }
        else {
            return null
        }
    }
}