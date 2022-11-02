import { hash, compare } from "bcrypt";
import { getXataClient } from "./xata";
import { IncomingMessage } from "http";

type OurUserAuth = { username?: string, isAuthenticated: boolean };

export const authenticate = async (req: IncomingMessage): Promise<OurUserAuth> => {

    // Get the authorization header
    const authorization = req.headers.authorization;
    if (!authorization) {
        return { isAuthenticated: false }
    }

    // Get username and password
    const [, credentials] = req.headers.authorization.split(" ")
    const [username, password] = Buffer.from(credentials, "base64").toString("utf-8").split(":")

    const xata = getXataClient()
    const user = await xata.db.users.filter({ username }).getFirst();

    // Check if user exists
    if (!user) {
        await xata.db.users.create({ username, password: await hash(password, 10) })
        return { username, isAuthenticated: true }
    }

    // Validates password
    const matchPassword = await compare(password, user.password);
    if (!matchPassword) {
        return { isAuthenticated: false }
    }


    return { username, isAuthenticated: true };

}