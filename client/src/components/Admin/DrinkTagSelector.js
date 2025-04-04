import React, {useEffect, useState} from "react"
import axios from "axios";
import {getColor} from "../DrinkTags";
import TagCategories from "../../definitions/TagCategories";
import "../../format/FilterPanel.css";

const DrinkTagSelector = ({tagSelectedList, setTagSelectedList}) => {

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
        return tagSelectedList && tagSelectedList.filter(tag => tag.category === category && tag.value === value).length > 0;
    }

    const onTagClick = (category, value) => {
        let newTagList = [];
        if(isTagSelected(category, value)){
            newTagList = tagSelectedList.filter((tag)=> {
                return !(tag.category === category && tag.value === value);
            });
        } else {
            if(tagSelectedList){
                newTagList = [...tagSelectedList, {category: category, value: value}];
            } else {
                newTagList = [{category: category, value: value}]
            }
        }
        setTagSelectedList(newTagList);
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