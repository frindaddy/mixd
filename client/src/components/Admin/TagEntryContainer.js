import React, {useEffect, useState} from "react";
import TagEntry from "./TagEntry";
import {FaPlus} from "react-icons/fa";
import FilterPanel from "../DrinkList/FilterPanel";
import "../../format/CreateDrink.css";
import DrinkTagSelector from "./DrinkTagSelector";

const TagEntryContainer = ({inputs, setInputs}) => {

    const [customTags, setCustomTags] = useState([{}]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loadLocked, setLoadLocked] = useState(false);

    useEffect(() => {
        if(inputs.tags && !loadLocked){
            setLoadLocked(true);
            setSelectedTags(inputs.tags);
        }
    }, [inputs]);

    function mergeTags(selTags, customTags) {
        let trimmedCustomTags = customTags.filter(tag => {
            return !selTags.map(tag => tag.category + '>' + tag.value).includes(tag.category + '>' + tag.value)
        });
        return selTags.concat(trimmedCustomTags)
    }

    const updateSelectedTags = (selTags) => {
        setSelectedTags(selTags);
        setInputs(values => ({...values, tags: mergeTags(selTags, customTags)}));
    }

    const updateCustomTags = (new_customTags) => {
        setCustomTags(new_customTags);
        setInputs(values => ({...values, tags: mergeTags(selectedTags, new_customTags)}));
    }

    return (
        <div>
            <DrinkTagSelector selectedTags={selectedTags} updateSelectedTags={updateSelectedTags} />
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