import { NextApiRequest, NextApiResponse } from "next";
import { XataClient } from "../../app/xata";
import { authenticate } from "../../app/authenticate";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const { isAuthenticated } = await authenticate(req);

    if (!isAuthenticated){
        res.status(401).end();
        return;
    }

    const {id} = req.body;

    const client = new XataClient();
    await client.db["todo-list"].delete({id});
    res.end()
}

export default handler;