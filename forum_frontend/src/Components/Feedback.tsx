import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { FeedbackProps } from "../lib/dataTypes";

function Feedback(props: FeedbackProps) {

    const [feedback, setFeedback] = useState<string>("");
    const [isError, setError] = useState<boolean>(false);
    const [textFieldClicked, setTextFieldClicked] = useState(false);
    
    // feedback change according to the user input
    function feedbackOnChange(event: React.FormEvent<EventTarget>): void {
        setFeedback((event.target as HTMLFormElement).value);
    }

    // submit the user feedback
    function submit(): void {
        setError(false);
        if (feedback.trim().length === 0) {
            setError(true);
        } else {
            props.submit(feedback);
        }
        setFeedback("");
    }

    // close the feedback section
    function cancelFeedback(): void {
        props.cancelFeedback();
        setError(false);
        setFeedback("");
        setTextFieldClicked(false);
    }

    return <Zoom in={props.showFeedback} mountOnEnter unmountOnExit timeout={300}>
        <div className="create-post-div">
            <Paper 
                square={false}
                elevation={10}
                style={{
                    width: "100%",
                    textAlign: "center",
                    padding: "20px",}}>

                {/* Close button for the feedback area */}
                <Tooltip title="Return" placement="top-end" onClick={cancelFeedback}
                    style={{width: "30px", height: "30px", marginBottom: "10px"}}>
                    <IconButton><CloseIcon /></IconButton>
                </Tooltip>

                {/* text field for the user's feedback input */}
                <TextField
                    id="outlined-multiline-flexible"
                    label={textFieldClicked ? isError ? "Feedback can't be empty" : "Feedback" : "Give us some feedback"}
                    onChange={feedbackOnChange}
                    onClick={() => setTextFieldClicked(true)}
                    value={feedback}
                    maxRows={10}
                    minRows={textFieldClicked ? 3 : 1}
                    multiline={true}
                    fullWidth
                    error={isError}
                    />

                {/* Submit button for the feedback */}
                <Button variant="contained" endIcon={<SendIcon />} onClick={submit}>
                    Send
                </Button>
            </Paper>
        </div>
    </Zoom> 
} 

export default Feedback;