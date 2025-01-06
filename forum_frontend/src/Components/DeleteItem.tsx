import { DeleteItemProps } from "../lib/dataTypes";

function DeleteItem(props: DeleteItemProps) {
    return <div>
        <p>Delete this {props.type}?</p>
        <button onClick={props.wantDelete}>yes</button>
        <button onClick={props.dontDelete}>no</button>
    </div>
}

export default DeleteItem;
