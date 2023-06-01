import React, { useState, useEffect } from "react";
import axios from 'axios';
import DrinkEntry from "./DrinkEntry";
import AddDrinkEntry from "../Admin/AddDrinkEntry";
import DotColor from "../DotColor";
const DrinkList = ({setCurrentPage, setCurrentDrink}) => {

    const [drinkList, setDrinkList] = useState([{name:"No Drink"}]);
    const [adminMode, setAdminMode] = useState(false);

    const getDrinkList = () => {
        axios.get('./api/list')
            .then((res) => {
                if (res.data) {
                    setDrinkList(res.data);
                }
            }).catch((err) => console.log(err));
    }

    const toggleAdminMode = () => {
        if (adminMode) {
            setAdminMode(false);
        } else {
            const adminPassword = prompt('Enter Admin Password');
            setAdminMode(adminPassword === 'ADMIN');
        }

    }

    useEffect(() => {
        getDrinkList();
    }, []);

    /*
    This is the search bar for v1.1
    
    <div className="search-container">
        <input className="search-bar" type="text" placeholder="Search..." />
    </div>
    */

    return (
        <>
        <div className='DrinkList'>
            <header>
                <div>
                    <div className="logo" onClick={toggleAdminMode}>mixd<DotColor /></div>
                </div>
            </header>

            {adminMode && <a href="#create"><AddDrinkEntry setCurrentPage={setCurrentPage}/></a>}
            {drinkList.map((drink) => {
                return <DrinkEntry admin={adminMode} drink={drink} setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink} getDrinkList={getDrinkList}/>
            })}
        </div>
        </>
    )
}

export default DrinkList;