import React, { useState, useEffect } from "react";
import axios from 'axios';
import AddDrinkEntry from "../Admin/AddDrinkEntry";
import DotColor from "../DotColor";
import DrinkArray from "./DrinkArray";
import FilterPanel from "./FilterPanel";
const DrinkList = ({setCurrentPage, setCurrentDrink, adminKey, setAdminKey}) => {

    const [drinkList, setDrinkList] = useState([{name:"Loading Drinks..."}]);
    const [searchText, setSearchText] = useState("");
    const [glassFilterList, setGlassFilterList] = useState();

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
                </div>
            </header>
            <FilterPanel setGlassFilterList={setGlassFilterList}/>
            {adminKey && <a href="#create"><AddDrinkEntry setCurrentPage={setCurrentPage}/></a>}
            <DrinkArray filter={{text: searchText, glasses: glassFilterList}} drinkList={drinkList} setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink} getDrinkList={getDrinkList} adminKey={adminKey}/>
        </div>
        </>
    )
}

export default DrinkList;