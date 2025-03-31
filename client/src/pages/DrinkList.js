import React, { useState, useEffect } from "react";
import axios from 'axios';
import AddDrinkEntry from "../components/Admin/AddDrinkEntry";
import DotColor from "../components/DotColor";
import DrinkArray from "../components/DrinkList/DrinkArray";
import FilterPanel from "../components/DrinkList/FilterPanel";
import {FaFilter, FaEraser, FaLemon, FaUserCircle, FaRegUserCircle} from "react-icons/fa";
import {useCookies} from "react-cookie";
import "../format/DrinkList.css";
import {Link, useLocation, useNavigate} from "react-router-dom";
import AccountShortcut from "../components/AccountShortcut";

const DrinkList = ({setShowLoader, searchText, setSearchText, user, setUser, previousDrinkList, setPreviousDrinkList, ingrFilter, setIngrFilter, userDrinksReq, setUserDrinksReq}) => {

    const [drinkList, setDrinkList] = useState(previousDrinkList);
    const [tagFilterList, setTagFilterList] = useState([]);
    const [filterPanelShown, setfilterPanelShown] = useState(false);
    const [cookies, setCookie] = useCookies(["tagList"]);

    const { hash } = useLocation();

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
        setTagFilterList([]);
        setIngrFilter(["", ""]);
        setUserDrinksReq(null);
        setCookie('tagList', [], {maxAge:3600});
    }

    function editingMenuID(){
        if(hash.match(/^#edit_menu-[0-9a-f]{8}$/i)){
            return hash.substring(11);
        } else {
            return null;
        }
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
                    <input name='search-bar' className="search-bar" type="text" placeholder="Search..." value={searchText} onChange={(e) => {setSearchText(e.target.value)}}/>
                    <div className='filter-toggle'><FaFilter style={{cursor:"pointer"}} onClick={toggleFilterPanel}/></div>
                    {((tagFilterList.length > 0) || ingrFilter[0] !== "" || userDrinksReq !== null) && <div className='filter-eraser'><FaEraser style={{cursor:"pointer"}} onClick={resetAllFilters} /></div>}
                </div>
            </header>
            <div className={'filter-panel'}>
                <FilterPanel toggleFilterPanel={toggleFilterPanel} tagFilterList={tagFilterList}
                setTagFilterList={setTagFilterList} tagMenu={false} ingrFilter={ingrFilter}/>
            </div>
            {user.adminKey && <Link to="/create_drink"><AddDrinkEntry /></Link>}
            <DrinkArray filter={{text: searchText, tags: tagFilterList}}
                drinkList={drinkList} getDrinkList={getDrinkList} setShowLoader={setShowLoader} adminKey={user.adminKey} editMenu={editingMenuID()}/>
        </>
    )
}

export default DrinkList;