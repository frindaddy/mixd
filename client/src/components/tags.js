import React from "react"
import TagColors from '../format/TagColors.js';
const DrinkTags = ({tags}) => {


    const getColor = (tag) => {
        return TagColors.gin;
    }

    return (
        <div className="flex-container">
            {
                tags.map((tag)=>{
                    return <div className="tag" style={{backgroundColor: getColor(tag)}}>{tag.value}</div>
                })
            }
        </div>
    )
}

export default DrinkTags;