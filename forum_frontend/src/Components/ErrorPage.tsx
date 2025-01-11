import Zoom from "@mui/material/Zoom";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import UndoIcon from '@mui/icons-material/Undo';
import anger from "../image/anger.png";
import logo from "../image/forum_icon.png";
import "../Style/errorPage.css";

function ErrorPage() {
    return <Stack direction="row" spacing={2} id="error-div">

        {/* error message */}
        <Stack direction="column" spacing={4} alignItems="center" justifyContent="center" className="errorMessage">
            <h2>Oops!...! Something is Not Working</h2>
            <h4>404 Page Not Found</h4>
            <Zoom in={true} timeout={1000} mountOnEnter>
                <div className="logoBox">
                    <h4>ChatterBox</h4>
                    <img src={logo} style={{width: "40px", height: "40px"}}/>
                </div>
            </Zoom>
            <Button variant="contained" className="shaky-btn"
                onClick={() => history.back()}
                endIcon={<UndoIcon />}>
                    Previous
            </Button>
        </Stack>
        <img id="anger" src={anger}></img>
    </Stack>
}

export default ErrorPage;