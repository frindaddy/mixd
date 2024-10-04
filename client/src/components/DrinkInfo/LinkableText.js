import React, {useEffect, useState} from "react"

const LinkableText = ({className, rawBodyText}) => {
    const [bodyText, setBodyText] = useState(rawBodyText);

    useEffect(() => {

    }, []);


    return (
        <div>
            <p className={className}>{bodyText}</p>
        </div>
    )
}

export default LinkableText;