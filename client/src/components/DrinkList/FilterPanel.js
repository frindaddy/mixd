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
    const [tab, setTab] = useState('tags');

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

    function changeTab(newTab) {
        setTab(newTab);
        expandFilterPanel();
    }

    return (
        <>
            <div className="filter-panel-container">
                <div className="filter-panel-navbar">
                    <span onClick={()=>changeTab('tags')}>Drink Tags</span>
                    <div className="filter-panel-navbar-separator"/>
                    <span onClick={()=>changeTab('ingredients')}>Ingredients</span>
                </div>
                {tab === 'tags' && <>
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
                </>}
                {tab === 'ingredients' && <>
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
                </>}
                {<div className='filter-chevron'><FaChevronUp style={{cursor:"pointer", marginBottom:"10px"}} onClick={() => {toggleFilterPanel()}}/></div>}
            </div>
        </>
    )
}

export default FilterPanel;