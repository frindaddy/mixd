import React from "react";
import TagColors from '../format/TagColors.js';
import { getDisplayName } from "./Admin/GlassTypes";

const DrinkTags = ({tags, glass}) => {

    return (
        <div className="tag-container">
            {
                tags.map((tag)=>{
                    return <div className="tag" style={{backgroundColor: getColor(tag)}}>{tag.value}</div>
                })
            }
            {glass && <div className="tag" style={{backgroundColor: getColor({category: 'glass'})}}>{glass}</div>}
        </div>
    )
}

export default DrinkTags;
export const filterTags = (unfilteredTags, categories) => {
    return unfilteredTags.filter((tag) =>{
        return categories.includes(tag.category)
    });
}
export const getColor = (tag) => {
    if ((tag.category === 'spirit' || tag.category ==='season') && TagColors[tag.value.toLowerCase()]){
        return TagColors[tag.value.toLowerCase()];
    }
    if (TagColors[tag.category]){
        return TagColors[tag.category];
    }
    return TagColors.misc;
};