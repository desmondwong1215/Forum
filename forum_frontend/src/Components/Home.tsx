import { useNavigate } from "react-router-dom";

function Home() {

    let navigate = useNavigate();

    return <div>
        <p>Welcome to Forum</p>
        <button onClick={() => navigate("./login")}>Log In</button>
    </div>
}

export default Home;