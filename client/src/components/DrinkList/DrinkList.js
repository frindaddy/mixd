import React, { useState, useEffect } from "react";
import axios from 'axios';
import DrinkEntry from "./DrinkEntry";
import AddDrinkEntry from "../Admin/AddDrinkEntry";
const DrinkList = ({setCurrentPage, setCurrentDrink}) => {

    const [drinkList, setDrinkList] = useState([{name:"No Drink"}]);

    const getDrinkList = () => {
        axios.get('./api/list')
            .then((res) => {
                if (res.data) {
                    setDrinkList(res.data);
                }
            }).catch((err) => console.log(err));
    }

    useEffect(() => {
        getDrinkList();
    }, []);

    return (
        <>
        <div className='DrinkList'>
            <header>
                <div>
                    <div className="logo">mixd.</div>
                </div>
            </header>

            <div className="search-container">
                <input className="search-bar" type="text" placeholder="Search..." />
            </div>
            <a href="#create"><AddDrinkEntry setCurrentPage={setCurrentPage}/></a>
            {drinkList.map((drink) => {
                return <DrinkEntry drink={drink} setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink} getDrinkList={getDrinkList}/>
            })}
        </div>
        </>
    )
}

export default DrinkList;