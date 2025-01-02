import { useState } from "react";
import Comment from "./Comment.tsx";
import Input from "./Input.tsx";
import DeleteItem from "./DeleteItem.tsx";
import { comment } from "../lib/dataTypes.tsx"

function Post(props: any) {

    const [showDelete, setShowDelete] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);

    function submitComment(content: string): void {
        props.submit(props.id, content)
    }

    function editTitle(newTitle: string): void {
        props.edit(props.id, true, newTitle);
        setShowEdit(false);
    }

    function commentLikeClicked(commentId: number, like: number, clicked: boolean) {
        props.likeClicked(props.id, commentId, like , clicked);
    }

    return <div>
        { showEdit 
            ? <Input value={props.title} submit={editTitle} back={() => setShowEdit(false)}/>
            : <h2>{props.title}</h2>}
        <p>Posted by {props.sameUser ? "you" : props.user}</p>
        {
            props.sameUser && !showDelete && <button onClick={() => setShowDelete(true)}>Delete</button>
        }
        {
            showDelete && <DeleteItem
                type="post"
                dontDelete={() => setShowDelete(false)}
                wantDelete={() => props.deletePost("post", props.id)}/>
        }
        {
            props.sameUser && !showEdit && <button onClick={() => setShowEdit(true)}>Edit</button>
        }
        <p>like: {props.like}</p>
        <p>Like is {props.clicked ? "" : "not "}clicked.</p>
        <button onClick={() => props.likeClicked(props.id, 0, props.like, props.clicked)}>Post Like</button>
        {
            props.comments.map((comment: comment) => <Comment
                key={comment.id}
                id={comment.id}
                content={comment.content}
                like={comment.like}
                clicked={comment.clicked}
                user={comment.user}
                deleteComment={props.deleteComment}
                edit={props.edit}
                likeClicked={commentLikeClicked}
            />)
        }
        <Input submit={submitComment} type={"Comment"}/>
    </div>
}

export default Post;