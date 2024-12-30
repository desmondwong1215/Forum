import { useState } from "react";
import Comment from "./Comment.tsx";
import Input from "./Input.tsx";
import DeletePost from "./DeletePost.tsx";
import { comment } from "../lib/dataTypes.tsx"

function Post(props: any) {

    const [showDelete, setShowDelete] = useState<boolean>(false);

    function likeClicked(commentId: number): void {
        props.commentLikeClicked(props.id, commentId);
    }

    function submitComment(content: string): void {
        props.submit(props.id, content)
    }

    function dontDelete(): void {
        setShowDelete(false);
    }

    function wantDelete() {
        props.wantDelete(props.id);
    }

    return <div>
        <h2>{props.title}</h2>
        <p>Posted by {props.sameUser ? "you" : props.user}</p>
        {props.sameUser && <button onClick={() => setShowDelete(true)}>Delete</button>}
        {showDelete && <DeletePost 
            dontDelete={dontDelete}
            wantDelete={wantDelete}/>}
        <p>like: {props.like}</p>
        <p>Like is {props.clicked ? "" : "not "}clicked.</p>
        <button onClick={() => props.postLikeClicked(props.id)}>Post Like</button>
        {
            props.comments.map((comment: comment) => <Comment
                key={comment.id}
                id={comment.id}
                content={comment.content}
                like={comment.like}
                clicked={comment.clicked}
                user={comment.user}
                commentLikeClicked={likeClicked}
            />)
        }
        <Input submit={submitComment} type={"Comment"}/>
    </div>
}

export default Post;