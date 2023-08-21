export class HashManagerMock {
    public hash = async (
        plaintext: string
    ): Promise<string> => {
        return "hash-mock"
    }

    public compare = async (
        plaintext: string,
        hash: string
    ): Promise<boolean> => {
        switch (plaintext) {
            case "admin01":
                return hash === "hash-mock-admin"

            case "user01":
                return hash === "hash-mock-user"

            default:
                return false
        }
    }
}