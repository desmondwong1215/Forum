import LightDarkSwitch from "./LightDarkSwitch";
import Avatar from '@mui/material/Avatar';
import { AccountBoxProps } from "../lib/dataTypes";
import { stringAvatar } from "../lib/createAvatar";

function AccountBox(props: AccountBoxProps) {
    return <div className="nav-item dropdown navbar-nav">

        {/* account avatar and name */}
        <a className="nav-link dropdown-toggle account-box" data-bs-toggle="dropdown" href="" role="button" aria-expanded="false">
            <Avatar {...stringAvatar(props.username!)} title={props.username}/>
            <p className="username">{props.username}</p>
        </a>

        {/* account box menu */}
        <ul className="dropdown-menu slideIn" style={{backgroundColor: props.isLight ? "#D9EAFD" : "#9AA6B2"}}>
            <li>
                <div id="active-box" className="dropdown-item disabled">
                    <div className="spinner-grow spinner-grow-sm text-success" style={{width: "0.5rem", height: "0.5rem", animationDuration: "1.5s"}} role="status">
                        <span className="visually-hidden">Active</span>
                    </div>
                    <a className="dropdown-item disabled" aria-disabled="true">Active</a>
                </div>
                </li>
            <li><a className="dropdown-item" href=""><LightDarkSwitch controlMode={props.controlMode} isLight={props.isLight}/></a></li>
            <li><button className="dropdown-item" onClick={props.setCreatePost}>Create Post</button></li>
            <li><button className="dropdown-item" onClick={props.setFeedback}>Feedback</button></li>
            <li><hr className="dropdown-divider" /></li>
            <li><a className="dropdown-item" aria-current="page" href="../login" onClick={props.logOutBut}>Log Out</a></li>
        </ul> 

    </div>
}

export default AccountBox;