import React, {useEffect, useState} from "react";
import TagEntry from "./TagEntry";
import {FaPlus} from "react-icons/fa";
const TagEntryContainer = ({inputs, setInputs}) => {

    const [tags, setTags] = useState([{}]);

    useEffect(() => {
        if(inputs.tags){
            setTags(inputs.tags);
        }
    }, [inputs]);

    const updateAllTags = (new_tags) => {
        setTags(new_tags);
        setInputs(values => ({...values, tags: new_tags}));
    }

    return (
        <div>
            {tags.map((tag, index) => {
                return <TagEntry index={index} tags={tags} setTags={updateAllTags}/>
            })}
            <div style={{display: "flex", justifyContent: "center", marginTop: "5px"}}>
                <FaPlus onClick={() => {setTags([...tags, {}])}}/>
            </div>
        </div>
    )
}

export default TagEntryContainer;