import React, {useEffect, useState} from "react";
import TagEntry from "./TagEntry";
import {FaPlus} from "react-icons/fa";
const TagEntryContainer = ({setInputs}) => {

    const [tags, setTags] = useState([{}]);

    useEffect(()=> {
        setInputs(values => ({...values, tags: tags}));
    }, [tags, setInputs]);

    return (
        <>
        <p style={{display: "flex", justifyContent: "center", margin: "0px"}}>Tags:</p>
        <div style={{display: "flex", justifyContent: "center", marginTop: "5px"}}>
            {tags.map((tag, index) => {
                return <TagEntry index={index} tags={tags} setTags={setTags}/>
            })}
            <FaPlus onClick={() => {setTags([...tags, {}])}}/>
        </div>
        </>
    )
}

export default TagEntryContainer;