import React, { useState, useEffect } from "react";
import axios from 'axios';
import AddDrinkEntry from "../components/Admin/AddDrinkEntry";
import DotColor from "../components/DotColor";
import DrinkArray from "../components/DrinkList/DrinkArray";
import FilterPanel from "../components/DrinkList/FilterPanel";
import {
    FaFilter,
    FaEraser,
    FaLemon,
    FaUser,
    FaUserMd,
    FaUserCog,
    FaUserCircle,
    FaUserTag,
    FaUserSecret, FaRegUser, FaRegUserCircle
} from "react-icons/fa";
import {useCookies} from "react-cookie";
import AddIngredientEntry from "../components/Admin/AddIngredientEntry";
import "../format/DrinkList.css";
import {Link, useNavigate} from "react-router-dom";

const DrinkList = ({setShowLoader, searchText, setSearchText, user, previousDrinkList, setPreviousDrinkList, ingrFilter, setIngrFilter, userDrinksReq, setUserDrinksReq}) => {

    const [drinkList, setDrinkList] = useState(previousDrinkList);
    const [glassFilterList, setGlassFilterList] = useState([]);
    const [tagFilterList, setTagFilterList] = useState([]);
    const [filterPanelShown, setfilterPanelShown] = useState(false);
    const [cookies, setCookie] = useCookies(["tagList", "glassList"]);

    const navigate = useNavigate();

    const getDrinkList = () => {
        let list_route = '/api/list/'+ingrFilter[0];
        if(userDrinksReq && userDrinksReq.user_id){
          list_route = '/api/user_drinks/'+userDrinksReq.user_id
            if(userDrinksReq.tol){
                list_route = list_route + '?tol='+userDrinksReq.tol;
                if(userDrinksReq.no_na) list_route = list_route + '&no_na=true';
                if(userDrinksReq.strict) list_route = list_route + '&strict=true';
            } else if (userDrinksReq.no_na) {
                list_route = list_route + '?no_na=true';
            }
        }
        axios.get(list_route)
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
        setGlassFilterList([]);
        setTagFilterList([]);
        setIngrFilter(["", ""]);
        setUserDrinksReq(null);
        setCookie('tagList', [], {maxAge:3600});
        setCookie('glassList', [], {maxAge:3600});
    }

    useEffect(() => {
        getDrinkList();
    }, [ingrFilter]);

    return (
        <>
            {!user.user_id && <FaRegUserCircle className="user_icon" onClick={()=>navigate('/account/login')}/>}
            {user.user_id && <FaUserCircle className="user_icon" onClick={()=>navigate('/account/login')}/>}
            <header>
                <div>
                    <div className="logo">mixd<DotColor /></div>
                </div>
                <div className="search-container">
                    <Link to="/view_ingredients" className='ingredient-button'><FaLemon style={{cursor:"pointer"}} /></Link>
                    <input name='search-bar' className="search-bar" type="text" placeholder="Search..." value={searchText} onChange={(e) => {setSearchText(e.target.value)}}/>
                    <div className='filter-toggle'><FaFilter style={{cursor:"pointer"}} onClick={toggleFilterPanel}/></div>
                    {((tagFilterList.length + glassFilterList.length > 0) || ingrFilter[0] !== "" || userDrinksReq !== null) && <div className='filter-eraser'><FaEraser style={{cursor:"pointer"}} onClick={resetAllFilters} /></div>}
                </div>
            </header>
            <div className={'filter-panel'}>
                <FilterPanel toggleFilterPanel={toggleFilterPanel} tagFilterList={tagFilterList}
                setTagFilterList={setTagFilterList} glassFilterList={glassFilterList}
                setGlassFilterList={setGlassFilterList} tagMenu={false} ingrFilter={ingrFilter}/>
            </div>
            {user.adminKey && <Link to="/create_drink"><AddDrinkEntry /></Link>}
            {user.adminKey && <hr className="list-separator"></hr>}
            {user.adminKey && <Link to="/manage_ingredients"><AddIngredientEntry /></Link>}
            <DrinkArray filter={{text: searchText, tags: tagFilterList, glasses: glassFilterList}}
                drinkList={drinkList} getDrinkList={getDrinkList} setShowLoader={setShowLoader} adminKey={user.adminKey}/>
        </>
    )
}

export default DrinkList;