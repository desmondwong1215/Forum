import { useState } from "react";
import { InputProps } from "../lib/dataTypes";

function Input(props: InputProps) {

    const [content, setContent] = useState<string>(props.value === undefined ? "" : props.value);

    // change according to the user input
    function contextOnChange(event: React.FormEvent<EventTarget>): void {
        setContent((event.target as HTMLFormElement).value);
    }

    // submit the content and set the textbox to "" again
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

        {/* only show if the user want to edit the content */}
        {
            props.value !== undefined && <button onClick={props.back}>Back</button>
        }
    </div>
}

export default Input;