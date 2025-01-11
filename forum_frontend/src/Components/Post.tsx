import { useState } from "react";
import Zoom from "@mui/material/Zoom";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MoreOptions from "./MoreOptions.tsx";
import Comment from "./Comment.tsx";
import { stringAvatar } from "../lib/createAvatar.tsx";
import { comment, PostProps } from "../lib/dataTypes.tsx"
import "../Style/post.css";

const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function Post(props: PostProps) {

    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(props.title);
    const [content, setContent] = useState<string>(props.content);
    const [comment, setComment] = useState<string>("");
    const [isTitleError, setTitleError] = useState<boolean>(false);
    const [isContentError, setContentError] = useState<boolean>(false);
    const [isCommentError, setCommentError] = useState<boolean>(false);
    const [isExpanded, setExpanded] = useState<boolean>(false);
    const month = Months[parseInt(props.month) - 1];

     // title change according to the user input
     function titleOnChange(event: React.FormEvent<EventTarget>): void {
        setTitle((event.target as HTMLFormElement).value);
    }

    // content change according to the user input
    function contextOnChange(event: React.FormEvent<EventTarget>): void {
        setContent((event.target as HTMLFormElement).value);
    }

    // comment change according to the user input
    function commentOnChange(event: React.FormEvent<EventTarget>): void {
        setComment((event.target as HTMLFormElement).value);
    }

    // submit the new post
    function submitComment(): void {
        setComment("");
        setCommentError(false);
        if (comment.trim().length === 0) {
            setCommentError(true);
            return;
        }
        props.submit(props.id, comment)
    }

    // edit the title of the post
    function editPost(): void {
        setTitleError(false);
        setContentError(false);
        if (title.trim().length === 0) {
            setTitleError(true);
            setTitle("");
        } else if (content.trim().length === 0) {
            setContentError(true);
            setContent("");
        } else {
            props.editPost(props.id, title, content);
            setShowEdit(false);
        }
    }

    // set the title and comment to their original state if `back` button is clicked
    function handleBackBtn(): void {
        setShowEdit(false);
        setTitle(props.title);
        setContent(props.content);
        setTitleError(false);
        setContentError(false);
    }

    // update the like of the comment
    function commentLikeClicked(commentId: number, like: number, clicked: boolean): void {
        props.likeClicked(props.id, commentId, like , clicked);
    }

    // handle the shrink of the comment section
    function closeComment(): void {
        setComment("");
        setCommentError(false);
        setExpanded(false);
    }

    return <Zoom in={true} mountOnEnter unmountOnExit>
        <div>
            <Card sx={{ width: 500 }} elevation={24} className={props.isLight ? "light-mode-card" : ""}>

                {/* card header show avatar, more option icon, title of the post */}
                <CardHeader
                    avatar={
                    <Avatar {...stringAvatar(props.user!)} title={props.sameUser ? "You" :  props.user}/>
                    }
                    action={
                    <MoreOptions 
                        sameUser={props.sameUser}
                        showEdit={showEdit}
                        isLight={props.isLight}
                        setShowEdit={setShowEdit}
                        delete={() => props.deleteItem("post", props.id)}/>
                    }
                    title={showEdit 
                            ? <TextField id="outlined-basic" variant="outlined" 
                                onChange={titleOnChange}
                                label={isTitleError ? "Post Title can't be empty" : "Post Title"}
                                value={title}
                                error={isTitleError}
                                fullWidth
                                autoFocus/>
                            : props.title}
                    subheader={month.concat(" ", props.day, ", ", props.year)}
                />

                {/* card content show the content of the post */}
                <CardContent>
                {showEdit 
                    ? <Stack>
                        <TextField
                            id="outlined-multiline-flexible"
                            label={isContentError ? "Post Content can't be empty" : 'Post Content'}
                            onChange={contextOnChange}
                            value={content}
                            maxRows={10}
                            minRows={3}
                            multiline={true}
                            error={isContentError}
                            fullWidth/>
                        <Button onClick={editPost}>Send</Button>
                        <Button onClick={handleBackBtn}>Back</Button>
                    </Stack>
                    : <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {props.content}
                    </Typography>}
                </CardContent>

                {/* Delete, edit and report the post */}
                <CardActions disableSpacing>

                    <Stack direction="row" alignItems="center" justifyContent="flex-end" width="100%">
                        {/* the commentId will be 0 if the item is a Post */}
                        <IconButton title="like" aria-label="add to favorites" 
                            className={"post-icon-box".concat(props.clicked ? "" : " icon-shake")}
                            onClick={() => props.likeClicked(props.id, 0, props.like, props.clicked)}
                        >
                            {props.clicked ? <FavoriteIcon />
                                        : <FavoriteBorderIcon />}
                        </IconButton>
                        <p style={{margin: 0}} title={`${props.like} people have liked the post`}>{props.like}</p>
                        
                        <IconButton title="share" aria-label="share" className="post-icon-box">
                            <ShareIcon />
                        </IconButton>
                    </Stack>
                </CardActions>

                {/* generate the comment of the post */}
                <Card className={"comment-card".concat(props.isLight ? " light-mode-popper" : " dark-mode-popper")}
                    style={{
                        borderColor: props.isLight ? "#C5D3E8" : "black"}}>
                    <CardHeader subheader="Comments" 
                        style={{
                            padding: "5px",
                            height: "40px",
                            borderBottom: "outset"
                        }} className="comment-title"/>
                    <CardContent style={{padding: "5px 5px 5px 16px", maxHeight: "300px", overflow: "auto"}}>
                        {/* Show the comment of the Post */}
                        {props.comments.length === 0
                            ? <p>No Comment Yet...</p>
                            : (isExpanded ? props.comments : props.comments.slice(0, 1)).map((comment: comment) => <Comment
                                key={comment.id}
                                id={comment.id}
                                year={comment.year}
                                month={comment.month}
                                day={comment.day}
                                content={comment.content}
                                like={comment.like}
                                clicked={comment.clicked}
                                user={comment.user}
                                deleteComment={props.deleteItem}
                                editComment={props.editComment}
                                likeClicked={commentLikeClicked}
                            />)}
                    </CardContent>

                    {/* the expand button of the post */}
                    {isExpanded && <TextField
                        id="standard-basic" 
                        label={isCommentError ? "Comment Can't be Empty" : "Enter Comment"}
                        value={comment}
                        error={isCommentError}
                        onChange={commentOnChange} 
                        variant="standard"
                        style={{
                            padding: "5px"
                        }} 
                        slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={submitComment} className="post-icon-box">
                                    <AddCircleIcon fontSize="large"/>
                                  </IconButton>
                                </InputAdornment>
                              ),
                            },
                          }}
                        fullWidth
                        />}
                </Card>

                <Stack alignItems="center">
                    {isExpanded
                        ? <IconButton onClick={closeComment} className="post-icon-box">
                            <ExpandLessIcon fontSize="large"/>
                        </IconButton>
                        : <IconButton onClick={() => setExpanded(true)} className="post-icon-box">
                            <ExpandMoreIcon fontSize="large"/>
                        </IconButton>}
                </Stack>
            </Card>
        </div>
    </Zoom>
}

export default Post;