import React, {useEffect, useState} from "react"
import {getDisplayName} from "../Admin/GlassTypes";
import axios from "axios";
import {getColor} from "../DrinkTags";
import {FaEraser} from "react-icons/fa";

const FilterPanel = ({tagFilterList, setTagFilterList, glassFilterList, setGlassFilterList}) => {

    const [allTags, setAllTags] = useState([]);
    const [allGlasses, setAllGlasses] = useState([]);

    useEffect(() => {
        axios.get('./api/tags/')
            .then((res) => {
                if (res.data) {
                    setAllTags(res.data.tags);
                    setAllGlasses(res.data.glasses);
                }
            }).catch((err) => console.log(err));
    }, []);

    function resetAllFilters() {
        setGlassFilterList([]);
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

    const onGlassClick = (glassClicked) => {
        if (glassFilterList.includes(glassClicked)) {
            setGlassFilterList(glassFilterList.filter((glass)=>{
                return glassClicked !== glass;
            }));
        } else {
            setGlassFilterList([...glassFilterList, glassClicked]);
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
            {allGlasses.map((glass) => {
                let selected = glassFilterList.includes(glass);
                return (
                    <div className="tag-container">
                        <div onClick={()=>{onGlassClick(glass)}} className={'tag clickable unselectable ' + (selected ? '':'unselected-tag-filter')} style={selected ? {backgroundColor: getColor({category: 'glass'})}: {}}>{getDisplayName(glass)}</div>
                    </div>
                )
            })}
            <div className='filter-erase'><FaEraser onClick={resetAllFilters} style={{cursor:"pointer"}}/></div>
        </>
    )
}

export default FilterPanel;