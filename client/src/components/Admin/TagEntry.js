import React, { useState } from "react"
import {FaMinus} from "react-icons/fa";

const categories = ['Spirit', 'Style','Taste', 'Mix', 'Color', 'Season', 'Temp', 'Misc'];

const TagEntry = ({index, tags, setTags, updateTags}) => {
    const [tag, setTag] = useState({});

    function handleFormChange(e) {
        let new_tag = {...tag, [e.target.name]:e.target.value};
        let temp_tags = tags;
        temp_tags[index] = new_tag;
        setTag(new_tag);
        setTags(temp_tags);
    }

    return (
        <div>
            <select name="category" onChange={handleFormChange}>
                <option value='no_cat' disabled={true} selected={true}>Category</option>
                {categories.map((cat)=>{
                    return <option value={cat.toLowerCase()}>{cat}</option>
                })}
            </select>
            <input type='text' placeholder='Tag (ex: Gin)' onChange={handleFormChange} value={tag.value||""} name='value'/>
            {(index === tags.length - 1) && <FaMinus onClick={() =>{setTags(tags.slice(0, index))}}/>}
        </div>
    )
}

export default TagEntry;