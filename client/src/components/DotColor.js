import React, { useState, useEffect } from "react";

const DotColor = ({toggleAdminMode}) => {

    const [color, setColor] = useState('#FFFFFF');

    useEffect(() => {
        let i = Math.floor(Math.random() * 5);
        let colors = ["#7856a1", "#5096ab", "#d6a038", "#6f8548", "#d66d2a"];
        setColor(colors[i]);
    }, [color]);

    return (
        <div onClick={toggleAdminMode} style={{WebkitTextStrokeColor: color, marginLeft: "-5px"}}>.</div>
    )
}

export default DotColor;