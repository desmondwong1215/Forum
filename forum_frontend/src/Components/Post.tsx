import { useState } from "react";
import { comment, PostProps } from "../lib/dataTypes.tsx"
import Comment from "./Comment.tsx";
import Input from "./Input.tsx";
import DeleteItem from "./DeleteItem.tsx";

function Post(props: PostProps) {

    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);

    // submit the new post
    function submitComment(content: string): void {
        props.submit(props.id, content)
    }

    // edit the title of the post
    function editTitle(newTitle: string): void {
        props.edit(props.id, true, newTitle);
        setShowEdit(false);
    }

    // update the like of the comment
    function commentLikeClicked(commentId: number, like: number, clicked: boolean): void {
        props.likeClicked(props.id, commentId, like , clicked);
    }

    return <div>

        {/* show the title in the text box to allow amendment if edit button is clicked
        else show the title only */}
        { showEdit 
            ? <Input value={props.title} type={"post"} submit={editTitle} back={() => setShowEdit(false)}/>
            : <h2>{props.title}</h2>}

        {/* "you" will be shown if the current user is the creator else show his/her username */}
        <p>Posted by {props.sameUser ? "you" : props.user}</p>

        {/* deletion can only be carried out by the creator */}
        {
            props.sameUser && !showDelete && !showEdit && <button onClick={() => setShowDelete(true)}>Delete</button>
        }

        {/* "Yes" and "No" will be shown to confirm or cancel deletion respectively */}
        { 
            showDelete && <DeleteItem
                type="post"
                dontDelete={() => setShowDelete(false)}
                wantDelete={() => props.deleteItem("post", props.id)}/>
        }

        {/* edition can only be carried out by the creator */}
        {
            props.sameUser && !showEdit && !showDelete && <button onClick={() => setShowEdit(true)}>Edit</button>
        }
        <p>like: {props.like}</p>
        <p>Like is {props.clicked ? "" : "not "}clicked.</p>

        {/* the commentId will be 0 if the item is a Post */}
        <button onClick={() => props.likeClicked(props.id, 0, props.like, props.clicked)}>Post Like</button>
        
        {/* Show the comment of the Post */}
        {
            props.comments.map((comment: comment) => <Comment
                key={comment.id}
                id={comment.id}
                content={comment.content}
                like={comment.like}
                clicked={comment.clicked}
                user={comment.user}
                deleteComment={props.deleteItem}
                edit={props.edit}
                likeClicked={commentLikeClicked}
            />)
        }

        {/* Input textbox for the post's comment */}
        <Input value={undefined} type={"Comment"} submit={submitComment} back={() => {}}/>
    </div>
}

export default Post;