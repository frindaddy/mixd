import React, {useEffect, useState} from "react"
import axios from "axios";
import {getColor} from "../DrinkTags";
import {FaChevronUp} from "react-icons/fa";
import {useCookies} from "react-cookie";
import TagCategories from "../../definitions/TagCategories";
import "../../format/FilterPanel.css";

const FilterPanel = ({toggleFilterPanel, tagFilterList, setTagFilterList, tagMenu, ingrFilter}) => {

    const CAT_ORDER = ['spirit', 'style', 'taste','misc'];

    const [allTags, setAllTags] = useState({});
    const [categoryList, setCategoryList] = useState([])
    const [cookies, setCookie] = useCookies(["tagList"]);

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
                }
            }).catch((err) => console.log(err));
        if(!tagMenu){
            if(cookies['tagList']){
                setTagFilterList(cookies['tagList']);
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
            newTagList = [...tagFilterList.filter(tagFilter => tagFilter.split('>')[0] !== category), category + '>' + value];
        }
        setTagFilterList(newTagList);
        if(!tagMenu){
            setCookie('tagList', newTagList, {maxAge:3600});
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
                                    </div>)
                            })}
                        </div>
                    </div>
                })}
                {!tagMenu && <div className='filter-chevron'><FaChevronUp style={{cursor:"pointer", marginBottom:"10px"}} onClick={() => {toggleFilterPanel()}}/></div>}
            </div>
        </>
    )
}

export default FilterPanel;