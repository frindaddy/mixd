import React from "react";
import TagColors from '../definitions/TagColors.js';

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
        return categories.includes(tag.category); // Only allow tags in the given categories
    }).sort((a, b) => { // Sort tags by the order given in "categories"
        let indexA = categories.indexOf(a.category);
        let indexB = categories.indexOf(b.category)
        if (indexA<indexB) return -1; // A is earlier on the category list than B
        if (indexA>indexB) return 1; // B is earlier on the category list than A
        return 0; // A & B are the same category
    });
}

export const getColor = (tag) => {
    if ((tag.category === 'spirit') && TagColors[tag.value.toLowerCase()]){
        return TagColors[tag.value.toLowerCase()];
    }
    if (TagColors[tag.category]){
        return TagColors[tag.category];
    }
    return TagColors.misc;
};