import { useParams } from "react-router-dom";
import { useState } from "react";
import { CommentProps } from "../lib/dataTypes";
import Zoom from "@mui/material/Zoom";
import Box from "@mui/material/Box";
import { stringAvatar } from "../lib/createAvatar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ReportIcon from '@mui/icons-material/Report';
import CardActions from "@mui/material/CardActions";
import "../Style/post.css"
import Stack from "@mui/material/Stack";
import Grow from "@mui/material/Grow";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function Comment(props: CommentProps) {

    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [isCommentError, setCommentError] = useState<boolean>(false);
    const [comment, setComment] = useState<string>(props.content);
    const { username } = useParams();
    const sameUser: boolean = props.user === username;

    // edit the content of the comment
    function editComment(): void {
        setCommentError(false);
        if (comment.trim().length === 0) {
            setCommentError(true);
            setComment("");
            return
        }
        props.editComment(props.id, comment);
        setShowEdit(false);
    }

    // content change according to the user input
    function contextOnChange(event: React.FormEvent<EventTarget>): void {
        setComment((event.target as HTMLFormElement).value);
    }

    // set the title and comment to their original state if `back` button is clicked
    function handleBackBtn(): void {
        setShowEdit(false);
        setComment(props.content);
        setCommentError(false);
    }
    
    return <Zoom in={true} mountOnEnter>
        <Box className="comment-box">
            <Stack direction="row" spacing={2}>
                <Avatar {...stringAvatar(props.user!)}
                    style={{width: "24px", height: "24px", fontSize: "10px"}}
                    title={sameUser ? "You" : props.user}/>
                {/* show the content in the text box to allow amendment if edit button is clicked
                else show the content only */}
                {
                    showEdit
                    ? <Stack spacing={2} className="comment">
                        <TextField
                            id="outlined-multiline-flexible"
                            label={isCommentError ? "Comment can't be empty" : 'Comment'}
                            onChange={contextOnChange}
                            value={comment}
                            maxRows={10}
                            minRows={3}
                            multiline={true}
                            error={isCommentError}
                            autoFocus
                            fullWidth/>
                        <Button onClick={editComment}>Send</Button>
                        <Button onClick={handleBackBtn}>Back</Button>
                    </Stack>
                    : <p className="comment">{props.content}</p>
                }
            </Stack>

            <CardActions style={{padding: 0}}>
                {!showEdit && <Stack direction="row" spacing={1}
                    style={{
                      width: "100%",
                      marginRight: "10px",
                      justifyContent: "space-between",  
                    }}>

                    {/* show the date of the comment is created */}
                    <Stack style={{justifyContent: "center"}}>
                       <p style={{margin: "0px"}}>{`${props.day}/${props.month}/${props.year}`}</p> 
                    </Stack>

                    {/* the stack for the action button */}
                    <Stack direction="row" spacing={1}
                        style={{
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "flex-end",  
                    }}>

                        {/* toggle between clicked and not clicked when the user click the heart icon */}
                        <IconButton title="like" aria-label="add to favorites" 
                            className={"comment-icon-box".concat(props.clicked ? "" : " icon-shake")}
                            onClick={() => props.likeClicked(props.id, props.like, props.clicked)}
                        >
                            {props.clicked 
                                ? <FavoriteIcon fontSize="small"/>
                                : <FavoriteBorderIcon fontSize="small" />}
                        </IconButton>

                        {/* show the number of users that have liked the comment */}
                        <p style={{margin: 0}} title={`${props.like} people have liked the comment`}>{props.like}</p>

                        {/* delete button for the comment, only applicable for the creator */}
                        {sameUser && !showDelete && <Grow in={!showDelete} mountOnEnter unmountOnExit timeout={300}>
                            <IconButton 
                                className="comment-icon-box icon-shake"
                                title="delete"
                                onClick={() => setShowDelete(true)}>
                                <DeleteForeverIcon fontSize="small"/>
                            </IconButton>
                        </Grow>}

                        {/* confirmation or cancellation of the deletion of comment */}
                        {showDelete && <Grow in={showDelete} mountOnEnter unmountOnExit timeout={300}>
                            <Stack direction="row">
                                <IconButton 
                                    className="comment-icon-box icon-shake"
                                    title="confirm"
                                    onClick={() => props.deleteComment("comment", props.id)}>
                                    <CheckIcon fontSize="small"/>
                                </IconButton>
                                <IconButton 
                                    className="comment-icon-box icon-shake"
                                    title="cancel"
                                    onClick={() => setShowDelete(false)}>
                                    <CloseIcon fontSize="small"/>
                                </IconButton>
                            </Stack>
                        </Grow>}

                        {/* edit button for the comment, only applicable for the creator */}
                        {sameUser && <IconButton 
                            title="edit"
                            className="comment-icon-box icon-shake"
                            onClick={() => setShowEdit(true)}>
                            <EditIcon fontSize="small"/>
                        </IconButton>}

                        {/* report button for the comment, one can only report the comment that is created by other users */}
                        {!sameUser && <IconButton 
                            title="report"
                            className="comment-icon-box icon-shake">
                            <ReportIcon fontSize="small"/>
                        </IconButton>}
                    </Stack>
                </Stack>}
            </CardActions>
        </Box>
    </Zoom>
}

export default Comment;