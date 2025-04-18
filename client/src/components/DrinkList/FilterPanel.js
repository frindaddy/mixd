import React, {useEffect, useState} from "react"
import axios from "axios";
import {getColor} from "../DrinkTags";
import {FaChevronUp} from "react-icons/fa";
import TagCategories from "../../definitions/TagCategories";
import "../../format/FilterPanel.css";
import IngredientCategories from "../../definitions/IngredientCategories";

const FilterPanel = ({user, toggleFilterPanel, searchIngredient, setSearchIngredient, searchTags, setSearchTags, myBarSearch, setMyBarSearch, expandFilterPanel}) => {

    const [allTags, setAllTags] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        axios.get('/api/tags/')
            .then((res) => {
                if (res.data) {
                    setAllTags(res.data);
                }
            }).catch((err) => console.log(err));
        axios.get('/api/count_ingredients')
            .then((res) => {
                if (res.data) {
                    setIngredients(res.data.filter(ingr => ingr.count > 0));
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

    function changeMyBarMode(clickedMode){
        if(myBarSearch.mode === clickedMode){
            setMyBarSearch({});
        } else if(clickedMode === 'onHand') {
            setMyBarSearch({user_id: user.user_id, tol: 0, no_na: false, strict: false, mode: 'onHand'});
        } else if(clickedMode === 'no_na') {
            setMyBarSearch({user_id: user.user_id, tol: 0, no_na: true, strict: false, mode: 'no_na'});
        }
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
                <h2 className="filter-panel-title">Drink Tags</h2>
                <p className="filter-panel-subtitle">Pick up to one tag from each category to search all of mixd for your perfect cocktail!</p>
                {TagCategories.map((cat)=>{
                    let categoryTags = allTags.filter(tag=>tag.category === cat.name);
                    if(categoryTags.length === 0) return <></>
                    return <div className="filter-category-container">
                        <p className="filter-category-title">{cat.localization}</p>
                        <div className="filter-category-tag-container">
                            {categoryTags.map((tag)=>{
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
                {user.user_id && <div className="filter-category-container">
                    <p className="filter-category-title">My Bar</p>
                    <div className="tag-container">
                        <div onClick={()=> changeMyBarMode('onHand')}
                             className={'tag clickable unselectable ' + (myBarSearch.mode==='onHand' ? '':'unselected-tag-filter')}
                             style={{backgroundColor: myBarSearch.mode==='onHand' ? 'green': ''}}>On Hand</div>
                        <div onClick={()=> changeMyBarMode('no_na')}
                            className={'tag clickable unselectable ' + (myBarSearch.mode==='no_na' ? '':'unselected-tag-filter')}
                            style={{backgroundColor: myBarSearch.mode==='no_na' ? 'green': ''}}>Liquor On Hand</div>
                        {myBarSearch.mode==='advanced' && <div onClick={()=> changeMyBarMode('advanced')}
                            className={'tag clickable unselectable'}
                            style={{backgroundColor: 'green'}}>Advanced Search</div>}
                    </div>
                </div>}
                <h2 className="filter-panel-title">Ingredients</h2>
                <p className="filter-panel-subtitle">Find all drinks that use a particular ingredient!</p>
                {IngredientCategories.map((cat)=>{
                    let catIngredients = ingredients.filter(ingr=>ingr.category === cat.name);
                    if (catIngredients.length === 0) return <></>
                    return <div className="filter-category-container">
                        <p className="filter-category-title">{cat.header}</p>
                        <div className="filter-category-tag-container">
                            {catIngredients.map((ingr)=>{
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