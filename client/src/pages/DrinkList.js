import React, { useState, useEffect } from "react";
import axios from 'axios';
import DotColor from "../components/DotColor";
import DrinkArray from "../components/DrinkList/DrinkArray";
import FilterPanel from "../components/DrinkList/FilterPanel";
import {FaFilter, FaEraser, FaSearch} from "react-icons/fa";
import "../format/DrinkList.css";
import AccountShortcut from "../components/AccountShortcut";

const DrinkList = ({setShowLoader, user, setUser, searchText, setSearchText, searchIngredient, setSearchIngredient, searchTags, setSearchTags, myBarSearch, setMyBarSearch}) => {

    const [drinkList, setDrinkList] = useState([]);
    const [filterPanelShown, setFilterPanelShown] = useState(false);
    const [featuredMenuName, setFeaturedMenuName] = useState('');
    const [listLoaded, setListLoaded] = useState(false);

    useEffect(() => {
        getDrinkList();
    }, [searchText, searchIngredient, searchTags, myBarSearch]);

    function getDrinkList() {
        if(showEraser()){
            axios.get('/api/search', {params : {searchText: searchText, tags: searchTags, ingredient: searchIngredient, user_id: myBarSearch.user_id, tol: myBarSearch.tol, strict: myBarSearch.strict}})
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
                        setFeaturedMenuName(res.data.name);
                        setDrinkList(res.data.drinkList);
                        setListLoaded(true);
                    }
                }).catch((err) => console.log(err));
        }

    }

    function toggleFilterPanel(){
        if(!filterPanelShown){
            expandFilterPanel();
            setFilterPanelShown(true);
        } else {
            collapseFilterPanel();
            setFilterPanelShown(false);
        }
    }

    function expandFilterPanel() {
        const filterPanel = document.querySelector(".filter-panel");
        var panelHeight = filterPanel.scrollHeight;
        filterPanel.style.height = panelHeight + 'px';
        filterPanel.addEventListener('transitioned', function () {
            filterPanel.removeEventListener('transitioned');
            filterPanel.style.height = null;
        });
    }

    function collapseFilterPanel() {
        const filterPanel = document.querySelector(".filter-panel")
        var panelHeight = filterPanel.scrollHeight
        requestAnimationFrame(function () {
            filterPanel.style.height = panelHeight + 'px';
            requestAnimationFrame(function () {
                filterPanel.style.height = 0 + 'px';
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
            <AccountShortcut user={user} setUser={setUser}/>
            <header>
                <div>
                    <div className="logo">mixd<DotColor /></div>
                </div>
                <div className="search-container">
                    <div className='filter-toggle'><FaFilter style={{cursor:"pointer", marginRight: '10px'}} onClick={toggleFilterPanel}/></div>
                    <input name='search-bar' className="search-bar" autoComplete="off" type="text" placeholder="Search..." value={searchText} onChange={(e) => {setSearchText(e.target.value)}}/>
                    <div className='filter-toggle'><FaSearch  style={{cursor:"pointer"}} onClick={getDrinkList}/></div>
                    {showEraser() && <div className='filter-eraser'><FaEraser style={{cursor:"pointer"}} onClick={clearSearchParams} /></div>}
                </div>
            </header>
            <div className={'filter-panel'}>
                <FilterPanel toggleFilterPanel={toggleFilterPanel} user={user} searchIngredient={searchIngredient} setSearchIngredient={setSearchIngredient} searchTags={searchTags} setSearchTags={setSearchTags} myBarSearch={myBarSearch} setMyBarSearch={setMyBarSearch}/>
            </div>
            {listLoaded && <>
                {featuredMenuName !== '' && <h1>{featuredMenuName}</h1>}
                {featuredMenuName === '' && <h1>Search Results</h1>}
                <DrinkArray drinkList={drinkList} getDrinkList={getDrinkList} setShowLoader={setShowLoader} />
            </>}
        </>
    )
}

export default DrinkList;