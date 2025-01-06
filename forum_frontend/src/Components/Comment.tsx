import { useParams } from "react-router-dom";
import { useState } from "react";
import { CommentProps } from "../lib/dataTypes";
import Input from "./Input";
import DeleteItem from "./DeleteItem";

function Comment(props: CommentProps) {

    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const { username } = useParams();
    const sameUser: boolean = props.user === username;

    // edit the content of the comment
    function editComment(newContent: string): void {
        props.edit(props.id, false, newContent);
        setShowEdit(false);
    }
    
    return <div>
        {/* show the content in the text box to allow amendment if edit button is clicked
        else show the content only */}
        {
            showEdit
            ? <Input type={"comment"} value={props.content} submit={editComment} back={() => setShowEdit(false)}/>
            : <p>{props.content}</p>
        }

        {/* "you" will be shown if the creator of the comment is current user, else show his/her username */}
        <p>By {sameUser ? "you" : props.user}</p>

        {/* delete can only be carried out by the comment's creator */}
        {
            sameUser && !showDelete && !showEdit && <button onClick={() => setShowDelete(true)}>Delete</button>
        }

        {/* "Yes" and "No" will shown to confirm or cancel deletion respectively */}
        {
            showDelete && <DeleteItem 
                type="comment"
                dontDelete={() => setShowDelete(false)}
                wantDelete={() => props.deleteComment("comment", props.id)}/>
        }

        {/* edit can only be carried out by the comment's creator */}
        {
            sameUser && !showDelete && !showEdit && <button onClick={() => setShowEdit(true)}>Edit</button>
        }
        <p>Like: {props.like}</p>
        <p>Like is {props.clicked ? "" : "not "}clicked.</p>
        <button onClick={() => props.likeClicked(props.id, props.like, props.clicked)}>Comment Like</button>
    </div>
}

export default Comment;