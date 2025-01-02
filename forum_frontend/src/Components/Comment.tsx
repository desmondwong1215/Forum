import { useParams } from "react-router-dom";
import { useState } from "react";
import Input from "./Input";
import DeleteItem from "./DeletePost";

function Comment(props: any) {

    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const { username } = useParams();
    const sameUser = props.user === username;

    function editComment(newContent: string) {
        props.edit(props.id, false, newContent);
        setShowEdit(false);
    }
    
    return <div>
        {
            showEdit
            ? <Input value={props.content} submit={editComment} back={() => setShowEdit(false)}/>
            : <p>{props.content}</p>
        }
        <p>By {sameUser ? "you" : props.user}</p>
        {
            sameUser && !showDelete && <button onClick={() => setShowDelete(true)}>Delete</button>
        }
        {
            showDelete && <DeleteItem 
                type="comment"
                dontDelete={() => setShowDelete(false)}
                wantDelete={() => props.deleteComment("comment", props.id)}/>
        }
        {
            sameUser && !showEdit && <button onClick={() => setShowEdit(true)}>Edit</button>
        }
        <p>Like: {props.like}</p>
        <p>Like is {props.clicked ? "" : "not "}clicked.</p>
        <button onClick={() => props.likeClicked(props.id, props.like, props.clicked)}>Comment Like</button>
    </div>
}

export default Comment;