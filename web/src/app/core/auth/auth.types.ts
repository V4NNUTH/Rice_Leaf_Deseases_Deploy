import { User } from "../user/user.types";

export interface ResponseLogin {
    access_token: string,
    token_type: string,
    expires_in: string,
    user: User,
    role: string
}
