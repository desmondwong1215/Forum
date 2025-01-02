function DeletePost(props: any) {
    return <div>
        <p>Delete this post?</p>
        <button onClick={props.wantDelete}>yes</button>
        <button onClick={props.dontDelete}>no</button>
    </div>
}

export default DeletePost;
