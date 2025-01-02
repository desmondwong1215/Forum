import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios"

const API_URL = "http://localhost:9090";

function Login() {

    const [username, setUsername] = useState<string>("");
    let navigate = useNavigate();

    async function LogInBut(): Promise<void> {
        if (username === "") return;
        await axios.post(`${API_URL}/login`, {"name": username});
        Cookies.set("username", username, {path: "/"})
        navigate(`../forum/${username}`);   
    }

    return <div>
        <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(event: any) => setUsername(event.target.value)}></input>
        <button onClick={LogInBut}>Login</button>
    </div>
}

export default Login;