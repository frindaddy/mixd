import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../../format/DrinkList.css";
import "../../format/Tabs.css";
import {Link, useLocation} from "react-router-dom";
import AddDrinkEntry from "../../components/Admin/AddDrinkEntry";
import DrinkArray from "../../components/DrinkList/DrinkArray";

const ManageDrinksTab = ({setShowLoader, user}) => {

    const [drinkList, setDrinkList] = useState([]);
    const [searchText, setSearchText] = useState("");

    const { hash } = useLocation();

    useEffect(() => {
        getDrinkList();
    }, []);

    const getDrinkList = () => {
        axios.get('/api/list')
            .then((res) => {
                if (res.data) {
                    setDrinkList(res.data);
                }
            }).catch((err) => console.log(err));
    }

    function editingMenuID(){
        if(hash.match(/^#edit_menu-[0-9a-f]{8}$/i)){
            return hash.substring(11);
        } else {
            return null;
        }
    }

    return (
        <>
            <h1 className="tab-title">{editingMenuID() ? "Add Drink to Menu":"Manage Drinks"}</h1>
            <div className="search-container">
                <input name='search-bar' className="search-bar" autoComplete="off" type="text" placeholder="Search..." value={searchText} onChange={(e) => {setSearchText(e.target.value)}}/>
            </div>
            {user.isAdmin && !editingMenuID() && <Link to="/create_drink"><AddDrinkEntry /></Link>}
            <DrinkArray user={user} filterText={searchText}
                        drinkList={drinkList} getDrinkList={getDrinkList} setShowLoader={setShowLoader} adminKey={user.token} editMenu={editingMenuID()}/>
        </>
    )
}

export default ManageDrinksTab;