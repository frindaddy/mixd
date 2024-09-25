import React, {useEffect, useState} from "react";
import TagEntry from "./TagEntry";
import {FaPlus} from "react-icons/fa";
import FilterPanel from "../DrinkList/FilterPanel";
const TagEntryContainer = ({inputs, setInputs}) => {

    const [customTags, setCustomTags] = useState([{}]);
    const [tagSelectedList, setTagSelectedList] = useState([]);
    const [loadLocked, setLoadLocked] = useState(false);

    useEffect(() => {
        if(inputs.tags && !loadLocked){
            setLoadLocked(true);
            setTagSelectedList(inputs.tags.map((inputTag)=>{
                return inputTag.category+'>'+inputTag.value
            }))
        }
    }, [inputs]);

    const validateAndFormatTags = (selectedTagStrings, customTagStrings) => {
        let allTags = [...new Set([...selectedTagStrings, ...customTagStrings])]
        return allTags.map((tagString) => {
            let split = tagString.split('>')
            return {category: split[0], value: split[1]}
        })
    }

    const updateSelectedTags = (selTags) => {
        let customTagString = customTags.map((inputTag)=>{
            return inputTag.category+'>'+inputTag.value
        })
        setTagSelectedList(selTags)
        setInputs(values => ({...values, tags: validateAndFormatTags(selTags, customTagString)}));
    }

    const updateCustomTags = (new_customTags) => {
        let customTagString = new_customTags.map((inputTag)=>{
            return inputTag.category+'>'+inputTag.value
        })
        setCustomTags(new_customTags);
        setInputs(values => ({...values, tags: validateAndFormatTags(tagSelectedList, customTagString)}));
    }

    return (
        <div>
            <FilterPanel setShowFilterPanel={undefined} tagFilterList={tagSelectedList} setTagFilterList={updateSelectedTags} glassFilterList={null} setGlassFilterList={null} tagMenu={true}/>
            <p>Add new tag:</p>
            {customTags.map((tag, index) => {
                return <TagEntry index={index} tags={customTags} setTags={updateCustomTags}/>
            })}
            <div style={{display: "flex", justifyContent: "center", marginTop: "5px"}}>
                <FaPlus onClick={() => {setCustomTags([...customTags, {}])}}/>
            </div>
        </div>
    )
}

export default TagEntryContainer;