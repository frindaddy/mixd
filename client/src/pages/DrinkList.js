import React, { useState, useEffect } from "react";
import axios from 'axios';
import Logo from "../components/Logo";
import DrinkArray from "../components/DrinkList/DrinkArray";
import DrinkTagsFilterPanel from "../components/DrinkList/DrinkTagsFilterPanel";
import IngredientsFilterPanel from "../components/DrinkList/IngredientsFilterPanel";
import {FaFilter, FaEraser, FaSearch, FaChevronUp} from "react-icons/fa";
import "../format/DrinkList.css";
import AccountShortcut from "../components/AccountShortcut";

const DrinkList = ({setShowLoader, user, setUser, searchText, setSearchText, searchIngredient, setSearchIngredient, searchTags, setSearchTags, myBarSearch, setMyBarSearch, removeCookie}) => {

    const [drinkList, setDrinkList] = useState([]);
    const [filterPanelShown, setFilterPanelShown] = useState(false);
    const [filterPanelPage, setFilterPanelPage] = useState('drinkTags');
    const [featuredMenuName, setFeaturedMenuName] = useState('');
    const [listLoaded, setListLoaded] = useState(false);

    useEffect(() => {
        getDrinkList();
    }, [searchText, searchIngredient, searchTags, myBarSearch]);

    function getDrinkList() {
        if(showEraser()){
            axios.get('/api/search', {params : {searchText: searchText, tags: searchTags, ingredient: searchIngredient, user_id: myBarSearch.user_id, tol: myBarSearch.tol, strict: myBarSearch.strict, no_na: myBarSearch.no_na}})
                .then((res) => {
                    if (res.data) {
                        setFeaturedMenuName('');
                        setDrinkList(res.data);
                        setListLoaded(true);
                    }
                }).catch((err) => console.log(err));
        } else {
            axios.get('/api/menu/featured')
                .then((res) => {
                    if (res.data) {
                        if(res.data.menu_id) {
                            setFeaturedMenuName(res.data.name);
                            setDrinkList(res.data.drinkList);
                        } else {
                            setFeaturedMenuName('No featured menu');
                            setDrinkList([]);
                        }
                        setListLoaded(true);
                    }
                }).catch((err) => console.log(err));
        }
    }

    function toggleFilterPanel(){
        if(!filterPanelShown){
            expandFilterPanel();
            if(filterPanelPage === 'drinkTags'){
                expandDrinkTagsPanel();
            } else if(filterPanelPage === 'ingredients'){
                expandIngredientsPanel();
            }
            setFilterPanelShown(true);
        } else {
            collapseFilterPanel();
            if(filterPanelPage === 'drinkTags'){
                collapseDrinkTagsFilterPanel();
            } else if(filterPanelPage === 'ingredients'){
                collapseIngredientsFilterPanel();
            }
            setFilterPanelShown(false);
        }
    }

    function expandFilterPanel() {
        const filterPanel = document.querySelector(".filter-panel");
        filterPanel.style.height = filterPanel.scrollHeight + 'px';
        filterPanel.addEventListener('transitioned', function () {
            filterPanel.removeEventListener('transitioned');
            filterPanel.style.height = null;
        });
    }

    function expandDrinkTagsPanel() {
        const drinkTagsFilterPanel = document.querySelector(".drink-tags-filter-panel");
        drinkTagsFilterPanel.style.height = drinkTagsFilterPanel.scrollHeight + 'px';
        drinkTagsFilterPanel.addEventListener('transitioned', function () {
            drinkTagsFilterPanel.removeEventListener('transitioned');
            drinkTagsFilterPanel.style.height = null;
        });
    }

    function expandIngredientsPanel() {
        const ingredientsFilterPanel = document.querySelector(".ingredients-filter-panel");
        ingredientsFilterPanel.style.height = ingredientsFilterPanel.scrollHeight + 'px';
        ingredientsFilterPanel.addEventListener('transitioned', function () {
            ingredientsFilterPanel.removeEventListener('transitioned');
            ingredientsFilterPanel.style.height = null;
        });
    }

    function collapseFilterPanel() {
        const filterPanel = document.querySelector(".filter-panel")
        requestAnimationFrame(function () {
            filterPanel.style.height = filterPanel.scrollHeight + 'px';
            requestAnimationFrame(function () {
                filterPanel.style.height = 0 + 'px';
            })
        });
    }

    function collapseDrinkTagsFilterPanel() {
        const drinkTagsFilterPanel = document.querySelector(".drink-tags-filter-panel")
        requestAnimationFrame(function () {
            drinkTagsFilterPanel.style.height = drinkTagsFilterPanel.scrollHeight + 'px';
            requestAnimationFrame(function () {
                drinkTagsFilterPanel.style.height = 0 + 'px';
            })
        });
    }

    function collapseIngredientsFilterPanel() {
        const ingredientsFilterPanel = document.querySelector(".ingredients-filter-panel")
        requestAnimationFrame(function () {
            ingredientsFilterPanel.style.height = ingredientsFilterPanel.scrollHeight + 'px';
            requestAnimationFrame(function () {
                ingredientsFilterPanel.style.height = 0 + 'px';
            })
        });
    }

    function clearSearchParams() {
        setSearchText('');
        setSearchTags([]);
        setSearchIngredient('');
        setMyBarSearch({});
    }

    function showEraser(){
        return (searchText && searchText !== '') || searchTags.length > 0 || searchIngredient !=='' || myBarSearch.user_id;
    }

    return (
        <>
            <AccountShortcut user={user} setUser={setUser} removeCookie={removeCookie}/>
            <header>
                <Logo/>
                <div className="search-container">
                    <div className='filter-toggle'><FaFilter style={{cursor:"pointer", marginRight: '10px'}} onClick={toggleFilterPanel}/></div>
                    <input name='search-bar' className="search-bar" autoComplete="off" type="text" placeholder="Search..." value={searchText} onChange={(e) => {setSearchText(e.target.value)}}/>
                    <div className='filter-toggle'><FaSearch  style={{cursor:"pointer"}} onClick={getDrinkList}/></div>
                    {showEraser() && <div className='filter-eraser'><FaEraser style={{cursor:"pointer"}} onClick={clearSearchParams}/></div>}
                </div>
            </header>
            <div className="filter-panel">
                <div className="filter-panel-navbar">
                    <span onClick={()=>{setFilterPanelPage('drinkTags'); expandDrinkTagsPanel()}}>Drink Tags</span>
                    <div className="filter-panel-navbar-separator"/>
                    <span onClick={()=>{setFilterPanelPage('ingredients'); expandIngredientsPanel()}}>Ingredients</span>
                </div>
                {<div className={'drink-tags-filter-panel'}>
                    <DrinkTagsFilterPanel user={user} searchTags={searchTags} setSearchTags={setSearchTags} myBarSearch={myBarSearch} setMyBarSearch={setMyBarSearch}/>
                </div>}
                {<div className={'ingredients-filter-panel'}>
                    <IngredientsFilterPanel searchIngredient={searchIngredient} setSearchIngredient={setSearchIngredient}/>
                </div>}
                <div className='filter-chevron'><FaChevronUp style={{cursor:"pointer", marginBottom:"10px"}} onClick={() => {toggleFilterPanel()}}/></div>
            </div>
            {listLoaded && <>
                {featuredMenuName !== '' && <h1 className="menu-title">{featuredMenuName}</h1>}
                {featuredMenuName === '' && <h1 className="menu-title">Search Results</h1>}
                <DrinkArray drinkList={drinkList} getDrinkList={getDrinkList} setShowLoader={setShowLoader}/>
            </>}
        </>
    )
}

export default DrinkList;