import { useState, useEffect } from "react";
import axios from 'axios';
import Logo from "../components/Logo";
import DrinkArray from "../components/DrinkList/DrinkArray";
import FilterPanel from "../components/DrinkList/FilterPanel";
import {FaFilter, FaEraser} from "react-icons/fa";
import "../format/DrinkList.css";
import AccountShortcut from "../components/AccountShortcut";
import RandomDrinkButton from "../components/RandomDrinkButton";

const DrinkList = ({setShowLoader, user, setUser, searchText, setSearchText, searchIngredient, setSearchIngredient, searchTags, setSearchTags, myBarSearch, setMyBarSearch, removeCookie}) => {

    const [drinkList, setDrinkList] = useState([]);
    const [filterPanelShown, setFilterPanelShown] = useState(false);
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
            setFilterPanelShown(true);
        } else {
            collapseFilterPanel();
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

    function collapseFilterPanel() {
        const filterPanel = document.querySelector(".filter-panel")
        requestAnimationFrame(function () {
            filterPanel.style.height = filterPanel.scrollHeight + 'px';
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
            <AccountShortcut user={user} setUser={setUser} removeCookie={removeCookie}/>
            <header>
                <Logo/>
                <div className="search-container">
                    <RandomDrinkButton/>
                    <input name='search-bar' className="search-bar" autoComplete="off" type="text" placeholder="Search..." value={searchText} onChange={(e) => {setSearchText(e.target.value)}}/>
                    <div className='filter-toggle'><FaFilter onClick={toggleFilterPanel}/></div>
                    {showEraser() && <div className='filter-eraser'><FaEraser onClick={clearSearchParams}/></div>}
                </div>
            </header>
            <div className={'filter-panel'}>
                <FilterPanel expandFilterPanel={expandFilterPanel} toggleFilterPanel={toggleFilterPanel} user={user} searchIngredient={searchIngredient} setSearchIngredient={setSearchIngredient} searchTags={searchTags} setSearchTags={setSearchTags} myBarSearch={myBarSearch} setMyBarSearch={setMyBarSearch}/>
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