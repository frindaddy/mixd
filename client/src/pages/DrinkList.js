import React, { useState, useEffect } from "react";
import axios from 'axios';
import AddDrinkEntry from "../components/Admin/AddDrinkEntry";
import DotColor from "../components/DotColor";
import DrinkArray from "../components/DrinkList/DrinkArray";
import FilterPanel from "../components/DrinkList/FilterPanel";
import {FaFilter, FaEraser, FaLemon} from "react-icons/fa";
import {useCookies} from "react-cookie";
import AddIngredientEntry from "../components/Admin/AddIngredientEntry";
import "../format/DrinkList.css";
import {Link} from "react-router-dom";

const DrinkList = ({setShowLoader, searchText, setSearchText, adminKey, setAdminKey, previousDrinkList, setPreviousDrinkList, ingrFilter, setIngrFilter}) => {

    const [drinkList, setDrinkList] = useState(previousDrinkList);
    const [glassFilterList, setGlassFilterList] = useState([]);
    const [tagFilterList, setTagFilterList] = useState([]);
    const [filterPanelShown, setfilterPanelShown] = useState(false);
    const [cookies, setCookie] = useCookies(["tagList", "glassList"]);

    const getDrinkList = () => {
        axios.get('/api/list/'+ingrFilter[0])
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
            const {data} = await axios.post('/api/admin_login',
                {password: adminPassword},
                {headers: {'Content-Type': 'application/json'}}
            );
            setAdminKey(data.adminKey);
        }
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
        filterPanel.addEventListener('transitioned', function (e) {
            filterPanel.removeEventListener('transitioned', arguments.callee);
            filterPanel.style.height = null;
        });
    }

    function collapseFilterPanel() {
        const filterPanel = document.querySelector(".filter-panel")
        var panelHeight = filterPanel.scrollHeight
        requestAnimationFrame(function () {
            filterPanel.style.height = panelHeight + 'px';
            filterPanel.style.transition = filterPanel.style.transition;
            requestAnimationFrame(function () {
                filterPanel.style.height = 0 + 'px';
            })
        });
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
            <header>
                <div>
                    <div className="logo">mixd<DotColor toggleAdminMode={toggleAdminMode} /></div>
                </div>
                <div className="search-container">
                    <Link to="/view_ingredients" className='ingredient-button'><FaLemon style={{cursor:"pointer"}} /></Link>
                    <input className="search-bar" type="text" placeholder="Search..." value={searchText} onChange={(e) => {setSearchText(e.target.value)}}/>
                    <div className='filter-toggle'><FaFilter style={{cursor:"pointer"}} onClick={toggleFilterPanel}/></div>
                    {((tagFilterList.length + glassFilterList.length > 0) || ingrFilter[0] !== "") && <div className='filter-eraser'><FaEraser style={{cursor:"pointer"}} onClick={resetAllFilters} /></div>}
                </div>
            </header>
            <div className={'filter-panel'}>
                <FilterPanel toggleFilterPanel={toggleFilterPanel} tagFilterList={tagFilterList}
                setTagFilterList={setTagFilterList} glassFilterList={glassFilterList}
                setGlassFilterList={setGlassFilterList} tagMenu={false} ingrFilter={ingrFilter}/>
            </div>
            {adminKey && <Link to="/create_drink"><AddDrinkEntry /></Link>}
            {adminKey && <hr className="list-separator"></hr>}
            {adminKey && <Link to="/manage_ingredients"><AddIngredientEntry /></Link>}
            <DrinkArray filter={{text: searchText, tags: tagFilterList, glasses: glassFilterList}}
                drinkList={drinkList} getDrinkList={getDrinkList} setShowLoader={setShowLoader} adminKey={adminKey}/>
        </>
    )
}

export default DrinkList;