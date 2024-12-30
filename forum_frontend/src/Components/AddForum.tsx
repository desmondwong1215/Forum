import { Navigate, useLocation } from "react-router-dom";
import Input from "./Input";

function AddForum(props: any) {

    const location  = useLocation();

    return props.authorised
        ? <div>
            <Input submit={location.state.submit}></Input>
        </div>
        : <Navigate to="./../login" />
}

export default AddForum;