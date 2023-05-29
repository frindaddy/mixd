import React from "react";
import TagColors from '../format/TagColors.js';

const DrinkTags = ({tags}) => {
    
    const getColor = (tag) => {
        if (tag.category === 'spirit' && TagColors[tag.value.toLowerCase()]){
            return TagColors[tag.value.toLowerCase()];
        }
        if (TagColors[tag.category]){
            return TagColors[tag.category];
        }
        return TagColors.misc;
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
export const filterTags = (unfilteredTags, categories) => {
    return unfilteredTags.filter((tag) =>{
        return categories.includes(tag.category)
    });
}