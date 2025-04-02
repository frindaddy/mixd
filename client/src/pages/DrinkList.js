import React, { useState, useEffect } from "react";
import axios from 'axios';
import DotColor from "../components/DotColor";
import DrinkArray from "../components/DrinkList/DrinkArray";
import FilterPanel from "../components/DrinkList/FilterPanel";
import {FaFilter, FaEraser, FaSearch} from "react-icons/fa";
import {useCookies} from "react-cookie";
import "../format/DrinkList.css";
import AccountShortcut from "../components/AccountShortcut";

const DrinkList = ({setShowLoader, searchText, setSearchText, user, setUser, previousDrinkList, setPreviousDrinkList, ingrFilter, setIngrFilter, userDrinksReq, setUserDrinksReq}) => {

    const [drinkList, setDrinkList] = useState(previousDrinkList);
    const [tagFilterList, setTagFilterList] = useState([]);
    const [filterPanelShown, setfilterPanelShown] = useState(false);
    const [cookies, setCookie] = useCookies(["tagList"]);

    const getDrinkList = () => {
        axios.get('/api/search', {params : {searchText: searchText}})
            .then((res) => {
                if (res.data) {
                    setDrinkList(res.data);
                    setPreviousDrinkList(res.data);
                }
            }).catch((err) => console.log(err));
    }

    const toggleFilterPanel = () => {
        if(!filterPanelShown){
            expandFilterPanel();
            setfilterPanelShown(true);
        } else {
            collapseFilterPanel();
            setfilterPanelShown(false);
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

    function resetAllFilters() {
        setTagFilterList([]);
        setIngrFilter(["", ""]);
        setUserDrinksReq(null);
        setCookie('tagList', [], {maxAge:3600});
    }

    useEffect(() => {
        getDrinkList();
    }, [ingrFilter]);

    return (
        <>
            <AccountShortcut user={user} setUser={setUser}/>
            <header>
                <div>
                    <div className="logo">mixd<DotColor /></div>
                </div>
                <div className="search-container">
                    <div className='filter-toggle'><FaFilter style={{cursor:"pointer", marginRight: '10px'}} onClick={toggleFilterPanel}/></div>
                    <input name='search-bar' className="search-bar" type="text" placeholder="Search..." value={searchText} onChange={(e) => {setSearchText(e.target.value)}}/>
                    <div className='filter-toggle'><FaSearch  style={{cursor:"pointer"}} onClick={getDrinkList}/></div>
                    {((tagFilterList.length > 0) || ingrFilter[0] !== "" || userDrinksReq !== null) && <div className='filter-eraser'><FaEraser style={{cursor:"pointer"}} onClick={resetAllFilters} /></div>}
                </div>
            </header>
            <div className={'filter-panel'}>
                <FilterPanel toggleFilterPanel={toggleFilterPanel} tagFilterList={tagFilterList}
                setTagFilterList={setTagFilterList} tagMenu={false} ingrFilter={ingrFilter}/>
            </div>
            <DrinkArray filter={{text: '', tags: tagFilterList}}
                drinkList={drinkList} getDrinkList={getDrinkList} setShowLoader={setShowLoader} />
        </>
    )
}

export default DrinkList;