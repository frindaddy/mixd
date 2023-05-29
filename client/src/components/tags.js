import React from "react"
import tag_colors from '../format/TagColors.js';
const DrinkTags = ({tags}) => {


    const getColor = (tag) => {
        return tag_colors.gin;
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