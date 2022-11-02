import { useState } from "react";
import { postReqest } from "../app/api";

export const TodoCreateForm = () => {

    const [label, setLabel] = useState("");

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
        }} style={{ display: "flex", alignItems: "end", justifyContent: "space-between", width: "400px" }} action="" method="post">
            <label>
                Label: {label}
                <input onChange={(e)=> setLabel(e.target.value)} style={{ padding: "10x 16px", height: "25px", marginTop: "10px" }} type="text" name="todo" />
            </label>

            <button onClick={() => {

                const data = {
                    label: label,
                }
                postReqest('/create', data)
                .then(response => {
                    if (response.ok) {
                        window.location.reload();
                    }
                })

            }} type="submit" style={{ padding: "15px 25px", marginBottom: "20px" }}>Add Todo</button>
        </form>
    );
}