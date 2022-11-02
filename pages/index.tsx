import Head from 'next/head';
import { FC, useState } from 'react';
import { getXataClient } from '../app/xata';
import { TodoCreateForm } from '../components/form';
import { postReqest } from '../app/api';
import { GetServerSidePropsContext } from 'next';
import { authenticate } from '../app/authenticate';

type Props = Awaited<ReturnType<typeof getServerSideProps>>['props'];

const Index: FC<Props> = ({ todos }) => {

    const [deleted, updateDeleted] = useState([]);

    return (

        <>
            <Head>
                <link rel="stylesheet" href="https://unpkg.com/mvp.css@1.12/mvp.css" key="test" />
            </Head>

            <main>
                <h1>My Todo List</h1>

                <TodoCreateForm />

                <ul>
                    {todos.map(t => {

                        const [is_done, updateState] = useState(t.is_done);

                        if (deleted.indexOf(t.id) === -1) {
                            return (
                                <li style={{ display: "flex", alignItems: "center", width: "350px", marginBottom: "20px" }} key={t.id}>
                                    <label>
                                        <input onChange={() => {
                                            const data = {
                                                id: t.id,
                                                is_done: t.is_done,
                                            }
                                            postReqest('/update', data)
                                                .then(response => {
                                                    if (!response.ok) {
                                                        alert("Error processing request");
                                                    } else {
                                                        updateState(!is_done);
                                                    }
                                                });

                                        }} checked={is_done} type="checkbox" />
                                        {t.label}
                                    </label>
                                    <button style={{ padding: "7px 10px", margin: "0 0 0 auto" }} onClick={() => {

                                        const data = {
                                            id: t.id,
                                        }

                                        postReqest('/delete', data)
                                            .then((response) => {
                                                if (response.status == 200) {
                                                    updateDeleted([...deleted, t.id]);
                                                } else {
                                                }
                                            });

                                    }}>Delete</button>
                                </li>
                            );
                        }

                    })}
                </ul>
            </main>
        </>
    );
}

export default Index;



export const getServerSideProps = async ({ req, res }: GetServerSidePropsContext) => {

    const { username, isAuthenticated } = await authenticate(req);

    if (isAuthenticated) {
        const todos = await getXataClient().db['todo-list'].filter({ "user.username": username }).getAll();
        return {
            props: {
                todos
            }
        }
    } else {
        res.writeHead(401, {
            "WWW-Authenticate": "Basic realm='This is a private todo list'",
            "Location": "/"
        }).end();
        return {
            props: {}
        }
    }
}
