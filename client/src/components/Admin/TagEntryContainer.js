import React, {useEffect, useState} from "react";
import TagEntry from "./TagEntry";
import {FaPlus} from "react-icons/fa";
const TagEntryContainer = ({setInputs}) => {

    const [tags, setTags] = useState([{}]);

    const updateAllTags = (new_tags) => {
        setTags(new_tags);
        setInputs(values => ({...values, tags: new_tags}));
    }

    return (
        <div>
            {tags.map((tag, index) => {
                return <TagEntry index={index} tags={tags} setTags={updateAllTags}/>
            })}
            <FaPlus onClick={() => {setTags([...tags, {}])}}/>
        </div>
    )
}

export default TagEntryContainer;