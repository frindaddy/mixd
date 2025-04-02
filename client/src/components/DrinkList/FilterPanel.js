import React, {useEffect, useState} from "react"
import axios from "axios";
import {getColor} from "../DrinkTags";
import {FaChevronUp} from "react-icons/fa";
import TagCategories from "../../definitions/TagCategories";
import "../../format/FilterPanel.css";

const FilterPanel = ({toggleFilterPanel, searchParams, updateSearchParams}) => {

    const [allTags, setAllTags] = useState({});

    useEffect(() => {
        axios.get('/api/tags/')
            .then((res) => {
                if (res.data) {
                    setAllTags(res.data.tags);
                    console.log(res.data.tags);
                }
            }).catch((err) => console.log(err));
    }, []);

    function isTagSelected(category, value) {
        return searchParams.tags && searchParams.tags.includes({category: category, value: value});
    }

    const onTagClick = (category, value) => {
        let newTagList = [];
        if(isTagSelected(category, value)){
            newTagList = searchParams.tags.filter((tag)=> {
                return tag.category !== category && tag.value !== value;
            });
        } else {
            newTagList = [...searchParams.tags.filter(tagFilter => tagFilter.category !== category), {category: category, value: value}];
        }
        updateSearchParams('tags', newTagList);
    }

    return (
        <>
            <div className="filter-panel-container">
                {TagCategories.map((cat)=>{
                    return <div className="filter-category-container">
                        <p className="filter-category-title">{cat.localization}</p>
                        <div className="filter-category-tag-container">
                            {[].map((tagName)=>{
                                let selected = isTagSelected(cat.name, tagName);
                                return (
                                    <div className="tag-container">
                                        <div onClick={()=>{onTagClick(cat.name, tagName)}}
                                             className={'tag clickable unselectable ' + (selected ? '':'unselected-tag-filter')}
                                             style={selected ? {backgroundColor: getColor({category: cat.name, value: tagName})}: {}}>{tagName}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                })}
                {<div className='filter-chevron'><FaChevronUp style={{cursor:"pointer", marginBottom:"10px"}} onClick={() => {toggleFilterPanel()}}/></div>}
            </div>
        </>
    )
}

export default FilterPanel;