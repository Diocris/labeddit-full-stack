import { TokenPayload, UserModel } from "../models/User"
import { UserDatabase } from "../database/UserDatabase"
import { User } from "../models/User"
import { UsersDB } from "../types/types"
import { IdGenerator } from "../services/idGenerator"
import { SignupInputDTO, SignupOutputDTO } from "../dtos/signup.dto"
import { TokenManager, TokenPayLoad, USER_ROLES } from "../services/TokenManager"
import { GetUsersInputDTO, GetUsersOutputDTO } from "../dtos/getUsers.dto"
import { HashManager } from "../services/HashManager"
import { LoginInputDTO, LoginOutputDTO } from "../dtos/login.dto"
import { NotFoundError } from "../errors/NotFoundError"
import { BadRequest } from "../errors/BadRequestError"


export class UserBusiness {
    constructor(private userDatabase: UserDatabase, private IdGenerator: IdGenerator, private tokenManager: TokenManager, private hashManager: HashManager) {

    }

    //
    //Get Users
    //
    public getUsers = async (input: GetUsersInputDTO): Promise<GetUsersOutputDTO> => {
        const { q, token } = input

        const payload = this.tokenManager.getPayLoad(token)

        if (payload === null) {
            throw new BadRequest("Token inválido.")
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            throw new BadRequest("Only Admins can use this function.")
        }

        const usersDB: UsersDB[] = await this.userDatabase.getUsers(q)

        const users = usersDB.map((userDB) => {
            const user = new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at
            )

            return user.toBusinessModel()
        })

        const output: GetUsersOutputDTO = users

        return output
    }

    //
    //SignUp
    //
    public signUp = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        const { name, email, password } = input


        const id = this.IdGenerator.generate()

        const hashedPassword = await this.hashManager.hash(password)

        const userDBExist: UsersDB = await this.userDatabase.getUserByEmail(email)



        if (userDBExist) {
            throw new BadRequest("User already registered, try another one.")
        }


        const newUser: User = new User(id, name, email, hashedPassword, USER_ROLES.NORMAL, new Date().toISOString())

        const newUserDB: UsersDB = {
            id: newUser.getId(),
            name: newUser.getName(),
            email: newUser.getEmail(),
            password: newUser.getPassword(),
            role: newUser.getRole(),
            created_at: newUser.getCreatedAt()
        }
        await this.userDatabase.createUser(newUserDB)

        const tokenPayLoad: TokenPayLoad = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole()
        }

        const token = this.tokenManager.createToken(tokenPayLoad)

        const output: any = {
            message: "Successfully registered user.",
            token
        }

        return output

    }

    //
    //Login
    //
    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {

        const { email, password } = input

        const userDB: UsersDB = await this.userDatabase.getUserByEmail(email)

        if (!userDB) {
            throw new NotFoundError("Email not found.")
        }

        const hashedPassword: string = userDB.password

        const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword)


        if (!isPasswordCorrect) {
            throw new BadRequest("Incorrect email or password.")
        }

        const user: User = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        )

        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole()
        }

        const token: string = this.tokenManager.createToken(payload)

        const output: LoginOutputDTO = {
            message: "Logged in.",
            token
        }

        return output
    }

    //
    //Delete User
    //
    // public deleteUser = async (input: DeleteInputDTO): Promise<DeleteOutputDTO> => {

    //     const { email } = input

    //     const emailExists: UsersDB = await this.userDatabase.getUserByEmail(email)


    //     if (!emailExists) {
    //         throw new NotFoundError("User not found.")
    //     }


    //     await this.userDatabase.deleteUser(emailExists.email)

    //     const output: DeleteOutputDTO = {
    //         message: "User deleted successfully."
    //     }

    //     return output

    // }

}