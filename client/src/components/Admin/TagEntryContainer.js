import React, {useEffect, useState} from "react";
import TagEntry from "./TagEntry";
import {FaPlus} from "react-icons/fa";
import FilterPanel from "../DrinkList/FilterPanel";
const TagEntryContainer = ({inputs, setInputs}) => {

    const [tags, setTags] = useState([{}]);
    const [tagSelectedList, setTagSelectedList] = useState([]);

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
            <FilterPanel setShowFilterPanel={undefined} tagFilterList={tagSelectedList} setTagFilterList={setTagSelectedList} glassFilterList={null} setGlassFilterList={null} tagMenu={true}/>
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