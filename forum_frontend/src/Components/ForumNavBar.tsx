import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import AccountBox from "./AccountBox";
import logo from "../image/forum_icon.png";
import { ForumNavBarProps } from "../lib/dataTypes";
import "../Style/forumNavBar.css";

function ForumNavBar(props: ForumNavBarProps) {

    const [isSearchBoxClicked,setSearchBoxClicked] = useState<boolean>(false);

    // search box will shrink if other place of the website is clicked
    useEffect(() => {
        $("#forum-div").click(() => {
            setSearchBoxClicked(false);
        });
    });

    return <nav id="forum-navbar" className="navbar fixed-top navbar-expand-lg">
        <div className="container-fluid">
            <a className="navbar-brand" href={`../forum/${props.username}`}>
            <div className="logoBox">
                <img id="forum-logo" src={logo}/>
                <p>ChatterBox</p>
            </div>        
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" 
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
                aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="../">Home</a>
                </li>
                <li className="nav-item">
                <button className="nav-link active" aria-current="page" onClick={props.setCreatePost}>Create Post</button>
                </li>
            </ul>

            {/* text field for user to enter keywords to search for Post */}
            <form id="searchBox" className={"d-flex ".concat(isSearchBoxClicked ? "searchClicked" : "searchNotClicked")} role="search">
                <TextField id="standard-basic" className="me-2" label="Search" variant="standard" fullWidth
                onClick={() => setSearchBoxClicked(true)} 
                value={props.keyWords} placeholder={"Enter Keyword"} onChange={props.keyWordsOnChange}
                slotProps={{
                    input: {
                    startAdornment: 
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>,
                    },
                }}
                />
            </form>

            {/* User Avater */}
            <AccountBox 
                username={props.username}
                controlMode={props.controlMode}
                isLight={props.isLight}
                setCreatePost={props.setCreatePost}
                setFeedback={props.setFeedback}
                logOutBut={props.logOutBut}/>
            </div>
        </div>
    </nav>
}

export default ForumNavBar;