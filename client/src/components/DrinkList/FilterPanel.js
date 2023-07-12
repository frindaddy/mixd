import React, {useEffect, useState} from "react"
import {getDisplayName} from "../Admin/GlassTypes";
import axios from "axios";
import {getColor} from "../DrinkTags";
import {FaChevronUp} from "react-icons/fa";

const FilterPanel = ({setShowFilterPanel, tagFilterList, setTagFilterList, glassFilterList, setGlassFilterList}) => {

    const CAT_ORDER = ['spirit', 'style', 'taste', 'season','color','mix','temp','misc','recommendation'];

    const [allTags, setAllTags] = useState({});
    const [categoryList, setCategoryList] = useState([])
    const [allGlasses, setAllGlasses] = useState([]);

    function populateCategoryList(tags) {
        setCategoryList(Object.keys(tags).sort((a, b)=>{
            let indexA = CAT_ORDER.indexOf(a);
            let indexB = CAT_ORDER.indexOf(b);
            // If category is not in sort list then send to the end
            if (indexA < 0) return 1;
            if (indexB < 0) return -1;
            // Sort in order of sort list (CAT_LIST)
            if(indexA < indexB) return -1;
            if(indexA > indexB) return 1;
            // If a & b are the same return the original order
            return 0;
        }));
    }

    useEffect(() => {
        axios.get('./api/tags/')
            .then((res) => {
                if (res.data) {
                    setAllTags(res.data.tags);
                    populateCategoryList(res.data.tags)
                    setAllGlasses(res.data.glasses);
                }
            }).catch((err) => console.log(err));
    }, []);

    const onTagClick = (category, value) => {
        if(tagFilterList.includes(category + '>' + value)){
            setTagFilterList(tagFilterList.filter((tag)=> {
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
            <div className="filter-panel-container">
                {categoryList.map((cat)=>{
                    return <div className="filter-category-container">
                        <p className="filter-category-title">{cat.charAt(0).toUpperCase() + cat.slice(1)}</p>
                        <div className="filter-category-tag-container">
                            {allTags[cat].map((tagName)=>{
                                let selected = tagFilterList.includes(cat+'>'+tagName);
                                return (
                                    <div className="tag-container">
                                        <div onClick={()=>{onTagClick(cat, tagName)}}
                                             className={'tag clickable unselectable ' + (selected ? '':'unselected-tag-filter')}
                                             style={selected ? {backgroundColor: getColor({category: cat, value: tagName})}: {}}>{tagName}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                })}
                <div className="filter-category-container">
                    <p className="filter-category-title">Glass</p>
                    <div className="filter-category-tag-container">
                        {allGlasses.map((glass) => {
                            let selected = glassFilterList.includes(glass);
                            return (
                                <div className="tag-container">
                                    <div onClick={()=>{onGlassClick(glass)}} className={'tag clickable unselectable ' + (selected ? '':'unselected-tag-filter')} style={selected ? {backgroundColor: getColor({category: 'glass'})}: {}}>{getDisplayName(glass)}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className='filter-chevron'><FaChevronUp style={{cursor:"pointer"}} onClick={() => {setShowFilterPanel(false)}}/></div>
        </>
    )
}

export default FilterPanel;