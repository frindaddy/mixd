import React, { useState, useEffect } from "react";
import axios from 'axios';
import AddDrinkEntry from "../Admin/AddDrinkEntry";
import DotColor from "../DotColor";
import DrinkArray from "./DrinkArray";
import FilterPanel from "./FilterPanel";
import {FaFilter} from "react-icons/fa";
import TagEntry from "../Admin/TagEntry";
import DrinkTags from "../DrinkTags";
const DrinkList = ({setCurrentPage, setCurrentDrink, adminKey, setAdminKey}) => {

    const [drinkList, setDrinkList] = useState([{name:"Loading Drinks..."}]);
    const [searchText, setSearchText] = useState("");
    const [glassFilterList, setGlassFilterList] = useState();
    const [tagFilterList, setTagFilterList] = useState([]);
    const [showFilterPanel, setShowFilterPanel] = useState(false);

    const getDrinkList = () => {
        axios.get('./api/list')
            .then((res) => {
                if (res.data) {
                    setDrinkList(res.data);
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

    useEffect(() => {
        getDrinkList();
    }, []);

    return (
        <>
        <div className='DrinkList'>
            <header>
                <div>
                    <div className="logo">mixd<DotColor toggleAdminMode={toggleAdminMode} /></div>
                </div>
                <div className="search-container">
                    <input className="search-bar" type="text" placeholder="Search..." value={searchText} onChange={(e) => {setSearchText(e.target.value)}}/>
                    <div style={{float: "right", margin:"5px 0px 0px 10px"}}><FaFilter style={{cursor:"pointer"}} onClick={() => {setShowFilterPanel(!showFilterPanel)}}/></div>
                </div>
            </header>
            <div className="filter-panel" style={showFilterPanel ? {display: "block"}:{display: "none"}}><FilterPanel tagFilterList={tagFilterList} setTagFilterList={setTagFilterList} setGlassFilterList={setGlassFilterList}/></div>
            {adminKey && <a href="#create"><AddDrinkEntry setCurrentPage={setCurrentPage}/></a>}
            <DrinkArray filter={{text: searchText, tags: tagFilterList, glasses: glassFilterList}} drinkList={drinkList} setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink} getDrinkList={getDrinkList} adminKey={adminKey}/>
        </div>
        </>
    )
}

export default DrinkList;