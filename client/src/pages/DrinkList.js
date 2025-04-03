import React, { useState, useEffect } from "react";
import axios from 'axios';
import DotColor from "../components/DotColor";
import DrinkArray from "../components/DrinkList/DrinkArray";
import FilterPanel from "../components/DrinkList/FilterPanel";
import {FaFilter, FaEraser, FaSearch} from "react-icons/fa";
import {useCookies} from "react-cookie";
import "../format/DrinkList.css";
import AccountShortcut from "../components/AccountShortcut";

const DrinkList = ({setShowLoader, user, setUser, searchText, setSearchText, searchIngredient, setSearchIngredient, searchTags, setSearchTags}) => {

    const [drinkList, setDrinkList] = useState([]);
    const [filterPanelShown, setFilterPanelShown] = useState(false);
    const [timeoutID, setTimeoutID] = useState(null);

    useEffect(() => {
        getDrinkList();
    }, [searchIngredient, searchTags]);

    function getDrinkList() {
        axios.get('/api/search', {params : {searchText: searchText, tags: searchTags, ingredient: searchIngredient}})
            .then((res) => {
                if (res.data) {
                    setDrinkList(res.data);
                }
            }).catch((err) => console.log(err));
    }

    function onSearchType(e) {
        if(timeoutID) clearTimeout(timeoutID);
        setTimeoutID(setTimeout(submitSearch, 500));
        setSearchText(e.target.value);
    }
    function submitSearch(){
        setTimeoutID(null);
        getDrinkList();
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
    }

    function showEraser(){
        return searchText !== '' || searchTags.length > 0 || searchIngredient !=='';
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
                    <input name='search-bar' className="search-bar" type="text" placeholder="Search..." value={searchText} onChange={(e) => {onSearchType(e)}}/>
                    <div className='filter-toggle'><FaSearch  style={{cursor:"pointer"}} onClick={getDrinkList}/></div>
                    {showEraser() && <div className='filter-eraser'><FaEraser style={{cursor:"pointer"}} onClick={clearSearchParams} /></div>}
                </div>
            </header>
            <div className={'filter-panel'}>
                <FilterPanel toggleFilterPanel={toggleFilterPanel} searchIngredient={searchIngredient} setSearchIngredient={setSearchIngredient} searchTags={searchTags} setSearchTags={setSearchTags}/>
            </div>
            <DrinkArray filter={{text: '', tags: []}}
                drinkList={drinkList} getDrinkList={getDrinkList} setShowLoader={setShowLoader} />
        </>
    )
}

export default DrinkList;