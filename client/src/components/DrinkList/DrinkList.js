import React, { useState, useEffect } from "react";
import axios from 'axios';
import DrinkEntry from "./DrinkEntry";
import {FaPlus} from "react-icons/fa";
const DrinkList = ({setCurrentPage, setCurrentDrink}) => {

    const [drinkList, setDrinkList] = useState([{name:"No Drink"}]);

    useEffect(() => {
        axios.get('./api/list')
            .then((res) => {
                if (res.data) {
                    setDrinkList(res.data);
                }
            }).catch((err) => console.log(err));
    }, []);

    return (
        <>
        <div className='DrinkList'>
            <header>
                <div>
                    <div className="logo">mixd.</div>
                </div>
            </header>

            <div className="search">
                <input type="text" placeholder="Search.." />
            </div>
            {drinkList.map((drink) => {
                return <a href={"#drink"}><DrinkEntry drink={drink} setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink}/></a>
            })}
            <a href="#create" className="back" onClick={()=>{setCurrentPage('createDrink')}} style={{cursor: "pointer"}}><FaPlus/></a>
        </div>
        </>
    )
}

export default DrinkList;