import { NextApiRequest, NextApiResponse } from "next";
import { XataClient } from "../../app/xata";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const {id, is_done} = req.body;

    const client = new XataClient();
    await client.db["todo-list"].update(id, { is_done: !is_done });

    res.status(200).json({ message: "success" });
}

export default handler;