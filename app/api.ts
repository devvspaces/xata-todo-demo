
type Body = { [key: string]: any };

export const postReqest = async (url: string, body: Body) => {
    url = `/api${url}`;
    return fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
}