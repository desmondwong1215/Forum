function DeleteItem(props: any) {
    return <div>
        <p>Delete this {props.type}?</p>
        <button onClick={props.wantDelete}>yes</button>
        <button onClick={props.dontDelete}>no</button>
    </div>
}

export default DeleteItem;
