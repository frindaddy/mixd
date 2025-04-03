import React, {useEffect, useState} from "react"
import axios from "axios";
import {getColor} from "../DrinkTags";
import {FaChevronUp} from "react-icons/fa";
import TagCategories from "../../definitions/TagCategories";
import "../../format/FilterPanel.css";
import IngredientCategories from "../../definitions/IngredientCategories";

const FilterPanel = ({toggleFilterPanel, searchIngredient, setSearchIngredient, searchTags, setSearchTags}) => {

    const [allTags, setAllTags] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        axios.get('/api/tags/')
            .then((res) => {
                if (res.data) {
                    setAllTags(res.data);
                }
            }).catch((err) => console.log(err));
        axios.get('/api/get_ingredients')
            .then((res) => {
                if (res.data) {
                    setIngredients(res.data);
                }
            }).catch((err) => console.log(err));
    }, []);

    function isTagSelected(category, value) {
        return searchTags && searchTags.filter(tag => tag.category === category && tag.value === value).length > 0;
    }

    const onTagClick = (category, value) => {
        let newTagList = [];
        if(isTagSelected(category, value)){
            newTagList = searchTags.filter((tag)=> {
                return tag.category !== category && tag.value !== value;
            });
        } else {
            if(searchTags){
                newTagList = [...searchTags.filter(tagFilter => tagFilter.category !== category), {category: category, value: value}];
            } else {
                newTagList = [{category: category, value: value}]
            }
        }
        setSearchTags(newTagList);
    }

    function onIngrClick(ingr_uuid){
        if(searchIngredient === ingr_uuid){
            setSearchIngredient('');
        } else {
            setSearchIngredient(ingr_uuid);
        }
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
                <br />
                {IngredientCategories.map((cat)=>{
                    return <div className="filter-category-container">
                        <p className="filter-category-title">{cat.header}</p>
                        <div className="filter-category-tag-container">
                            {ingredients.filter(ingr=>ingr.category === cat.name).map((ingr)=>{
                                let selected = searchIngredient === ingr.uuid;
                                return (
                                    <div className="tag-container">
                                        <div onClick={()=>{onIngrClick(ingr.uuid)}}
                                             className={'tag clickable unselectable ' + (selected ? '':'unselected-tag-filter')}
                                             style={selected ? {backgroundColor: 'green'}: {}}>{ingr.name}</div>
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