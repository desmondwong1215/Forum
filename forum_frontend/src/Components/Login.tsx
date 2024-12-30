import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login(props: any) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    function LogInBut(): void {
        if (username === "") return;
        props.logIn(true, username);
        navigate(`../forum/${username}`);   
    }

    return <div>
        <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(event: any) => setUsername(event.target.value)}></input>
        <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(event: any) => setPassword(event.target.value)}></input>
        <button onClick={LogInBut}>Login</button>
    </div>
}

export default Login;