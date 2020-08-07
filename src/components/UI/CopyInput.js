import React, { useRef, useState } from "react";
import { Input, InputGroup, InputGroupAddon, Button } from "reactstrap";

function CopyInput({ value }) {
    const inputElement = useRef();
    const [hasCopied, setHasCopied] = useState(false);

    const copyToClipboard = () => {
        inputElement.current.select();
        document.execCommand("copy");
        setHasCopied(true);
    };

    return (
        <InputGroup>
            <Input
                value={value}
                readOnly
                onClick={copyToClipboard}
                innerRef={inputElement}
                style={{ cursor: "pointer" }}
            />
            <InputGroupAddon addonType="append">
                <Button onClick={copyToClipboard}>{hasCopied ? "Copied!" : "Click to copy"}</Button>
            </InputGroupAddon>
        </InputGroup>
    );
}

export default CopyInput;
