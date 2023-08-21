import { UserDB } from "../models/UserModel";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static USERS_TABLE = "users"

    //
    //Get Users
    //
    public async getUsers(id?: string): Promise<UserDB[]> {

        let result: UserDB[]
        if (id !== undefined) {
            result = await BaseDatabase.connection(UserDatabase.USERS_TABLE).where({ id: id })
        } else {
            result = await BaseDatabase.connection(UserDatabase.USERS_TABLE)
        }

        return result

    }

    //Criar get users by id

    //
    //Get User by Email
    //
    public async getUserByEmail(email: string): Promise<UserDB> {
        const [result] = await BaseDatabase.connection(UserDatabase.USERS_TABLE).where({ email: email })
        return result
    }

    //
    //Create User
    //
    public async createUser(userDB: UserDB): Promise<void> {
        await BaseDatabase.connection(UserDatabase.USERS_TABLE).insert(userDB)
    }


    //
    //Edit User
    //
    public async editUser(idToEdit: string, userDB: UserDB): Promise<void> {
        await BaseDatabase.connection(UserDatabase.USERS_TABLE).update(userDB).where({ id: idToEdit })
    }

    //
    //Delete User
    //
    public async deleteUser(email: string): Promise<void> {
        await BaseDatabase.connection(UserDatabase.USERS_TABLE).del().where({ email: email })
    }


}