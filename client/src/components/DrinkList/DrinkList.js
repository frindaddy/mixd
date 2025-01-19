import React, { useState, useEffect } from "react";
import axios from 'axios';
import AddDrinkEntry from "../Admin/AddDrinkEntry";
import DotColor from "../DotColor";
import DrinkArray from "./DrinkArray";
import FilterPanel from "./FilterPanel";
import {FaFilter, FaEraser, FaLemon} from "react-icons/fa";
import {useCookies} from "react-cookie";
import AddIngredientEntry from "../Admin/AddIngredientEntry";

const DrinkList = ({setCurrentPage, setCurrentDrink, searchText, setSearchText, adminKey, setAdminKey, previousDrinkList, setPreviousDrinkList, ingrFilter, setIngrFilter}) => {

    const [drinkList, setDrinkList] = useState(previousDrinkList);
    const [glassFilterList, setGlassFilterList] = useState([]);
    const [tagFilterList, setTagFilterList] = useState([]);
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [filterPanelOpenedBefore, setFilterPanelOpenedBefore] = useState(false);
    const [cookies, setCookie] = useCookies(["tagList", "glassList"]);

    const getDrinkList = () => {
        axios.get('./api/list/'+ingrFilter[0])
            .then((res) => {
                if (res.data) {
                    setDrinkList(res.data);
                    setPreviousDrinkList(res.data);
                }
            }).catch((err) => console.log(err));
    }

    const toggleAdminMode = async () => {
        if (adminKey) {
            setAdminKey(null);
        } else {
            const adminPassword = prompt('Enter Admin Password');
            const {data} = await axios.post('./api/admin_login',
                {password: adminPassword},
                {headers: {'Content-Type': 'application/json'}}
            );
            setAdminKey(data.adminKey);
        }
    }

    const toggleFilterPanel = () => {
        setShowFilterPanel(!showFilterPanel);
        setFilterPanelOpenedBefore(true);
    }

    function goToIngredientsPage() {
        setCurrentPage('viewIngredients')
    }

    function resetAllFilters() {
        setGlassFilterList([]);
        setTagFilterList([]);
        setIngrFilter(["", ""]);
        setCookie('tagList', [], {maxAge:3600});
        setCookie('glassList', [], {maxAge:3600});
    }

    useEffect(() => {
        getDrinkList();
    }, [ingrFilter]);

    return (
        <>
        <div className='DrinkList'>
            <header>
                <div>
                    <div className="logo">mixd<DotColor toggleAdminMode={toggleAdminMode} /></div>
                </div>
                <div className="search-container">
                    <div className='ingredient-button'><FaLemon style={{cursor:"pointer"}} onClick={goToIngredientsPage}/></div>
                    <input className="search-bar" type="text" placeholder="Search..." value={searchText} onChange={(e) => {setSearchText(e.target.value)}}/>
                    <div className='filter-toggle'><FaFilter style={{cursor:"pointer"}} onClick={toggleFilterPanel}/></div>
                    {((tagFilterList.length + glassFilterList.length > 0) || ingrFilter[0] !== "") && <div className='filter-eraser'><FaEraser style={{cursor:"pointer"}} onClick={resetAllFilters} /></div>}
                </div>
            </header>
            <div className={showFilterPanel ? 'filter-panel-show':'filter-panel-hide'}
                style={filterPanelOpenedBefore ? {display: "block"}:{display: "none"}}>
                <FilterPanel setShowFilterPanel={setShowFilterPanel} tagFilterList={tagFilterList}
                setTagFilterList={setTagFilterList} glassFilterList={glassFilterList}
                setGlassFilterList={setGlassFilterList} tagMenu={false} ingrFilter={ingrFilter}/>
            </div>
            {adminKey && <a href="#create"><AddDrinkEntry setCurrentPage={setCurrentPage}/></a>}
            {adminKey && <hr className="drink-list-separator"></hr>}
            {adminKey && <a href="#ingredients"><AddIngredientEntry setCurrentPage={setCurrentPage}/></a>}
            <DrinkArray filter={{text: searchText, tags: tagFilterList, glasses: glassFilterList}}
                drinkList={drinkList} setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink}
                getDrinkList={getDrinkList} adminKey={adminKey}/>
            <hr className="drink-list-separator"></hr>
        </div>
        </>
    )
}

export default DrinkList;