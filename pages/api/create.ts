import { NextApiRequest, NextApiResponse } from "next";
import { authenticate } from "../../app/authenticate";
import { getXataClient } from "../../app/xata";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { isAuthenticated, username } = await authenticate(req);

    if (!isAuthenticated){
        res.status(401).end();
        return;
    }

    const {label} = req.body;

    const client = getXataClient();
    const user = await client.db.users.filter("username", username).getFirst();
    await client.db["todo-list"].create({ label, user: { id: user.id } });
    res.end()
}

export default handler;