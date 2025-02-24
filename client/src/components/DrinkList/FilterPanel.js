import React, {useEffect, useState} from "react"
import {getDisplayName} from "../Admin/GlassTypes";
import axios from "axios";
import {getColor} from "../DrinkTags";
import {FaChevronUp} from "react-icons/fa";
import {useCookies} from "react-cookie";
import TagCategories from "../../definitions/TagCategories";
import "../../format/FilterPanel.css";

const FilterPanel = ({setShowFilterPanel, tagFilterList, setTagFilterList, glassFilterList, setGlassFilterList, tagMenu, ingrFilter}) => {

    const CAT_ORDER = ['spirit', 'style', 'taste', 'season','color','mix','temp','misc','top_pick'];

    const [allTags, setAllTags] = useState({});
    const [categoryList, setCategoryList] = useState([])
    const [allGlasses, setAllGlasses] = useState([]);
    const [cookies, setCookie] = useCookies(["tagList", "glassList"]);

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
        axios.get('/api/tags/')
            .then((res) => {
                if (res.data) {
                    setAllTags(res.data.tags);
                    populateCategoryList(res.data.tags)
                    setAllGlasses(res.data.glasses);
                }
            }).catch((err) => console.log(err));
        if(!tagMenu){
            if(cookies['tagList']){
                setTagFilterList(cookies['tagList']);
            }
            if(cookies['glassList']){
                setGlassFilterList(cookies['glassList']);
            }
        }
    }, []);

    const onTagClick = (category, value) => {
        let newTagList = [];
        if(tagFilterList.includes(category + '>' + value)){
            newTagList = tagFilterList.filter((tag)=> {
                return tag !== category + '>' + value;
            });
        } else {
            newTagList = [...tagFilterList, category + '>' + value];
        }
        setTagFilterList(newTagList);
        if(!tagMenu){
            setCookie('tagList', newTagList, {maxAge:3600});
        }
    }

    const onGlassClick = (glassClicked) => {
        if(!tagMenu){
            let newGlassList = [];
            if (glassFilterList.includes(glassClicked)) {
                newGlassList = glassFilterList.filter((glass)=>{
                    return glassClicked !== glass;
                });
            } else {
                newGlassList = [...glassFilterList, glassClicked];
            }
            setGlassFilterList(newGlassList);
            setCookie('glassList', newGlassList, {maxAge:3600});
        }
    }

    const getCategoryLocalization = (categoryName) => {
        let search = TagCategories.filter((category) => category.name === categoryName);
        if(search.length > 0){
            return search[0].localization;
        } else {
            return 'Unknown category \''+categoryName+'\'';
        }
    }

    return (
        <>
            {ingrFilter && ingrFilter[0] !=="" && <span style={{display:"flex", justifyContent: "center", fontStyle:"italic"}}>{'Only showing drinks using '+ingrFilter[1]}</span>}
            <div className="filter-panel-container">
                {categoryList.map((cat)=>{
                    return <div className="filter-category-container">
                        <p className="filter-category-title">{getCategoryLocalization(cat)}</p>
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
                {!tagMenu &&
                    <div className="filter-category-container">
                        <p className="filter-category-title">Glass</p>
                        <div className="filter-category-tag-container">
                            {allGlasses.map((glass) => {
                                let selected = glassFilterList.includes(glass);
                                return (
                                    <div className="tag-container">
                                        <div onClick={()=>{onGlassClick(glass)}} className={'tag clickable unselectable ' + (selected ? '':'unselected-tag-filter')}
                                            style={selected ? {backgroundColor: getColor({category: 'glass'})}: {}}>{getDisplayName(glass)}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                }

            </div>
            {!tagMenu && <div className='filter-chevron'><FaChevronUp style={{cursor:"pointer"}} onClick={() => {setShowFilterPanel(false)}}/></div>}
        </>
    )
}

export default FilterPanel;