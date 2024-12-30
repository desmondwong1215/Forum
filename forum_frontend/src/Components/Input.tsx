import { useState } from "react";

function Input(props: any) {

    const [content, setContent] = useState("");

    function contextOnChange(event: any): void {
        setContent(event.target.value);
    }

    function submitContent(): void {
        if (content === "") return;
        setContent("");
        props.submit(content);
    }

    return <div>
        <input type="text" 
            value={content} 
            placeholder={`Please Enter New ${props.type} Title Here`}
            onChange={contextOnChange}
            size={50}></input>
        <button onClick={submitContent}>Submit Content</button>
    </div>
}

export default Input;