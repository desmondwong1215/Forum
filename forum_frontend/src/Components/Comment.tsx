import { useParams } from "react-router-dom";

function Comment(props: any) {

    const { username } = useParams();

    return <div>
        <p>{props.content}</p>
        <p>By {props.user === username ? "you" : props.user}</p>
        <p>Like: {props.like}</p>
        <p>Like is {props.clicked ? "" : "not "}clicked.</p>
        <button onClick={() => props.commentLikeClicked(props.id)}>Comment Like</button>
    </div>
}

export default Comment;