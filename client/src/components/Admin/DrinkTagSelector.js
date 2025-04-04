import React, {useEffect, useState} from "react"
import axios from "axios";
import {getColor} from "../DrinkTags";
import TagCategories from "../../definitions/TagCategories";
import "../../format/FilterPanel.css";

const DrinkTagSelector = ({selectedTags, updateSelectedTags}) => {

    const [allTags, setAllTags] = useState([]);

    useEffect(() => {
        axios.get('/api/tags/')
            .then((res) => {
                if (res.data) {
                    setAllTags(res.data);
                }
            }).catch((err) => console.log(err));
    }, []);

    function isTagSelected(category, value) {
        return selectedTags && selectedTags.filter(tag => tag.category === category && tag.value === value).length > 0;
    }

    const onTagClick = (category, value) => {
        let newTagList = [];
        if(isTagSelected(category, value)){
            newTagList = selectedTags.filter((tag)=> {
                return !(tag.category === category && tag.value === value);
            });
        } else {
            if(selectedTags){
                newTagList = [...selectedTags, {category: category, value: value}];
            } else {
                newTagList = [{category: category, value: value}]
            }
        }
        updateSelectedTags(newTagList);
    }

    return (
        <>
            <div className="filter-panel-container">
                {TagCategories.map((cat)=>{
                    return <div className="filter-category-container">
                        <p className="filter-category-title">{cat.localization}</p>
                        <div className="filter-category-tag-container">
                            {allTags.filter(tag=>tag.category === cat.name).map((tag)=>{
                                let selected = isTagSelected(cat.name, tag.value);
                                return (
                                    <div className="tag-container">
                                        <div onClick={()=>{onTagClick(cat.name, tag.value)}}
                                             className={'tag clickable unselectable ' + (selected ? '':'unselected-tag-filter')}
                                             style={selected ? {backgroundColor: getColor({category: cat.name, value: tag.value})}: {}}>{tag.value}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                })}
            </div>
        </>
    )
}

export default DrinkTagSelector;