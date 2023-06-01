import React, { useState, useEffect } from "react";

const DotColor = () => {

    const pickColor = () => {
        var i = Math.floor(Math.random() * 5);
        var colors = ["#7856a1", "#5096ab", "#d6a038", "#6f8548", "#d66d2a"];
        return colors[i];
    };

    return (
        <p style={{color: {pickColor}}}>.</p>
    )

}

export default DotColor;