import { useState } from "react";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { CreatePostProps } from "../lib/dataTypes";
import "../Style/createPost.css"

function CreatePost(props: CreatePostProps) {

    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [textFieldClicked, setTextFieldClicked] = useState<boolean>(false);
    const [isTitleError, setTitleError] = useState<boolean>(false);
    const [isContentError, setContentError] = useState<boolean>(false);

    // title change according to the user input
    function titleOnChange(event: React.FormEvent<EventTarget>): void {
        setTitle((event.target as HTMLFormElement).value);
    }

    // content change according to the user input
    function contextOnChange(event: React.FormEvent<EventTarget>): void {
        setContent((event.target as HTMLFormElement).value);
    }

    // submit the content and set the textbox to "" again
    function submitContent(): void {
        setContentError(false);
        setTitleError(false);
        if (title.trim().length === 0) {
            setTitle("");
            setTitleError(true);
        } else if (content.trim().length === 0) {
            setContent("");
            setContentError(true);
        } else {
            setTitle("");
            setContent("");
            props.submit(title, content);
        }
    }

    // reset the CreatePost when delete button is clicked
    function deleteClicked(): void {
        setContent("");
        setTitle("");
        setTitleError(false);
        setContentError(false);
        setTextFieldClicked(false);
    }

    // cancel the creation of the post
    function cancelCreatePost(): void {
        props.cancelCreatePost();
        setTitleError(false);
        setContentError(false);
        setTextFieldClicked(false);
    }

    return <Zoom in={props.showCreatePost} mountOnEnter unmountOnExit timeout={300}>
        <div className="create-post-div">
            <Paper 
                square={false}
                elevation={10}
                style={{
                    width: "100%",
                    textAlign: "center",
                    padding: "20px",
                }}>

                {/* Close button for the post create area */}
                <Tooltip title="Return" placement="top-end" onClick={cancelCreatePost}
                    style={{width: "30px", height: "30px", marginBottom: "10px"}}>
                    <IconButton><CloseIcon /></IconButton>
                </Tooltip>

                {/* Post title input area */}
                <Fade in={textFieldClicked} mountOnEnter unmountOnExit timeout={300}>
                    <TextField id="outlined-basic" label={isTitleError ? "Post Title can't be empty" : "Post Title"} variant="outlined" 
                        onChange={titleOnChange}
                        value={title}
                        fullWidth
                        autoFocus
                        error={isTitleError}/>
                </Fade>

                {/* Post content input area */}
                <TextField
                    id="outlined-multiline-flexible"
                    label={textFieldClicked ? isContentError ? "Post Content can't be empty" : "Post Content" : 'Share Your Thoughts'}
                    onChange={contextOnChange}
                    onClick={() => {
                        setTitleError(false);
                        setTextFieldClicked(true)
                    }}
                    value={content}
                    maxRows={10}
                    minRows={textFieldClicked ? 3 : 1}
                    multiline={true}
                    fullWidth
                    error={isContentError}
                    />

                {/* Confirmation and cancellation of the new post */}
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                    <Button variant="contained" endIcon={<SendIcon />} onClick={submitContent}>
                        Send
                    </Button>
                    <Button variant="outlined" endIcon={<DeleteIcon />} onClick={deleteClicked}>
                        Delete
                    </Button>
                </Stack>
            </Paper>
        </div>
    </Zoom>
    
    
}

export default CreatePost;