import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Slide from "@mui/material/Slide";
import Zoom from "@mui/material/Zoom"
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import AccountCircle from '@mui/icons-material/AccountCircle';
import ForumAxios from "../forumAxios";
import LoginIcon from '@mui/icons-material/Login';
import logo from "../image/forum_icon.png";
import "../Style/login.css";

function Login() {

    const [username, setUsername] = useState<string>("");
    const [isError, setError] = useState<boolean>(false);
    const navigate = useNavigate();

    // register the user if the current user is a new user and set the cookies for the current user
    async function LogInBut(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setError(false);
        if (username.trim().length === 0) {
            setUsername("");
            setError(true);
            return;
        };
        const response = await ForumAxios.post(`/login`, {"name": username}, {withCredentials: true});
        const { access_token } = response.data

        // store access_token at the local storage
        localStorage.setItem("access_token", access_token);

        // set authorization header for future requests
        ForumAxios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
        navigate(`../forum/${username}`);   
    }

    return <Zoom in={true} timeout={800}>
        <form className="login-container" onSubmit={(event) => LogInBut(event)}>

            {/* ChatterBox logo */}
            <Slide in={true} timeout={1000} mountOnEnter>
                <div className="logoBox">
                    <h2>ChatterBox</h2>
                    <img src={logo}/>
                </div>
            </Slide>

            {/* Username input */}
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField id="input-with-sx" 
                    label={isError ? "Username can't be empty" : "Enter Username"} 
                    variant="standard"
                    value={username}
                    onChange={(event: any) => setUsername(event.target.value)}
                    slotProps={{
                        input: {
                          endAdornment: 
                            <InputAdornment position="end">
                                <Button type="submit" 
                                    variant="contained" 
                                    size="small" 
                                    endIcon={<LoginIcon />}
                                    style={{
                                        marginBottom: "20px"
                                    }}>Login</Button>
                            </InputAdornment>,
                        },
                    }}
                    error={isError}
                    autoFocus />
            </Box>
        </form>
    </Zoom>
}

export default Login;