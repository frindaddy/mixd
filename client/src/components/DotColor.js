import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const DotColor = ({toggleAdminMode}) => {

    const [color, setColor] = useState('#FFFFFF');
    const [cookies, setCookie] = useCookies(['colorIndex']);

    useEffect(() => {
        let dotColors = ["#7856a1", "#5096ab", "#d6a038", "#6f8548", "#d66d2a"];
        let colorIndex = cookies.colorIndex || 0;
        setColor(dotColors[colorIndex])
        if(colorIndex < 4) {
            setCookie('colorIndex', ++colorIndex)
        } else {
            setCookie('colorIndex', 0);
        }
    }, []);

    return (
        <div onClick={toggleAdminMode} style={{WebkitTextStrokeColor: color, marginLeft: "-5px"}}>.</div>
    )
}

export default DotColor;