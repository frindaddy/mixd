import React, {useEffect, useState} from "react";
import TagEntry from "./TagEntry";
import {FaPlus} from "react-icons/fa";
import FilterPanel from "../DrinkList/FilterPanel";
import "../../format/CreateDrink.css";
import DrinkTagSelector from "./DrinkTagSelector";

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
        let mappedTags = allTags.map((tagString) => {
            let split = tagString.split('>')
            if(split[0] !== 'undefined' && split[1] !== 'undefined' && split[0] !== '' && split[1] !== ''){
                return {category: split[0], value: split[1]}
            }
        })
        return mappedTags.filter(tag =>tag !== undefined);
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
            <DrinkTagSelector tagSelectedList={tagSelectedList} setTagSelectedList={setTagSelectedList} />
            <div className="create-drink-row">Add new tag:</div>
            <div className="create-drink-row">
                <div>
                {customTags.map((tag, index) => {
                    return <TagEntry index={index} tags={customTags} setTags={updateCustomTags}/>
                })}
                </div>
            </div>
            <div style={{display: "flex", justifyContent: "center", marginTop: "-15px"}}>
                <FaPlus onClick={() => {setCustomTags([...customTags, {}])}}/>
            </div>
        </div>
    )
}

export default TagEntryContainer;