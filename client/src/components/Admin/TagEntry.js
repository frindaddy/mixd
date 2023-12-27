import React, {useEffect, useState} from "react"
import {FaMinus} from "react-icons/fa";
import TagCategories from "../../definitions/TagCategories";

const TagEntry = ({index, tags, setTags}) => {
    const [tag, setTag] = useState({});

    useEffect(() => {
        if(tags[index].category && tags[index].value){
            setTag({category: tags[index].category, value: tags[index].value})
        }
    }, [index, tags]);

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
                <option value='no_cat' disabled={true} selected={!tag.category}>Category</option>
                {TagCategories.map((cat)=>{
                    return <option selected={cat.name===tag.category} value={cat.name}>{cat.localization}</option>
                })}
            </select>
            <input type='text' placeholder='Tag (ex: Rye)' onChange={handleFormChange} value={tag.value||""} name='value'/>
            {(index === tags.length - 1) && <FaMinus style={{marginLeft: "5px"}}
                onClick={() =>{setTags(tags.slice(0, -1))}}/>}
        </div>
    )
}

export default TagEntry;