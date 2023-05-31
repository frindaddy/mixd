import React, {useEffect, useState} from "react";
import TagEntry from "./TagEntry";
import {FaPlus} from "react-icons/fa";
const TagEntryContainer = ({setInputs}) => {

    const [tags, setTags] = useState([{}]);

    useEffect(()=> {
        setInputs(values => ({...values, tags: tags}));
        console.log(tags);
    }, [tags, setInputs]);

    return (
        <div>
            {tags.map((tag, index) => {
                return <TagEntry index={index} tags={tags} setTags={setTags}/>
            })}
            <FaPlus onClick={() => {setTags([...tags, {}])}}/>
        </div>
    )
}

export default TagEntryContainer;