import React, {useEffect, useState} from "react"
import GlassTypes from "../Admin/GlassTypes";
import axios from "axios";
import {getColor} from "../DrinkTags";
import {FaEraser} from "react-icons/fa";

const FilterPanel = ({tagFilterList, setTagFilterList, setGlassFilterList}) => {

    const [allTags, setAllTags] = useState([]);
    const [glassInputs, setGlassInputs] = useState({});

    useEffect(() => {
        axios.get('./api/tags/')
            .then((res) => {
                if (res.data) {
                    setAllTags(res.data);
                }
            }).catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        let glassFilterList = [];
        GlassTypes.forEach((glass) => {
           if (glassInputs[glass.name] === true) {
               glassFilterList.push(glass.name);
           }
        });
        setGlassFilterList(glassFilterList);
    }, [glassInputs]);

    function handleGlassChange(e) {
        setGlassInputs({...glassInputs, [e.target.name]:e.target.checked});
    }

    function resetAllFilters() {
        setGlassInputs({});
        setTagFilterList([]);
    }

    const onTagClick = (category, value) => {
        if(tagFilterList.includes(category + '>' + value)){
            setTagFilterList(tagFilterList.filter((tag)=>{
                return tag !== category + '>' + value;
            }));
        } else {
            setTagFilterList([...tagFilterList, category + '>' + value]);
        }
    }

    return (
        <>
        <div className="filter-category-container">
            {Object.keys(allTags).map((cat)=>{
                return <div className="">
                    <p>{cat.charAt(0).toUpperCase() + cat.slice(1)}</p>
                    {allTags[cat].map((tagName)=>{
                        let selected = tagFilterList.includes(cat+'>'+tagName);
                        return (
                            <div className="tag-container">
                                <div onClick={()=>{onTagClick(cat, tagName)}} className={'tag clickable unselectable ' + (selected ? '':'unselected-tag-filter')} style={selected ? {backgroundColor: getColor({category: cat, value: tagName})}: {}}>{tagName}</div>
                            </div>
                        )
                    })}
                </div>
            })}
        </div>
            <p>Glass</p>
            {GlassTypes.map((glass) => {
               return <label><input type="checkbox" checked={glassInputs[glass.name]} name={glass.name} onChange={handleGlassChange}/>{glass.displayName}</label>
            })}
            <div className='filter-erase'><FaEraser onClick={resetAllFilters} style={{cursor:"pointer"}}/></div>
        </>
    )
}

export default FilterPanel;