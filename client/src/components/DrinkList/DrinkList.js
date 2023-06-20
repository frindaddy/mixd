import React, { useState, useEffect } from "react";
import axios from 'axios';
import DrinkEntry from "./DrinkEntry";
import AddDrinkEntry from "../Admin/AddDrinkEntry";
import DotColor from "../DotColor";
const DrinkList = ({setCurrentPage, setCurrentDrink, adminKey, setAdminKey}) => {

    const [drinkList, setDrinkList] = useState([{name:"Loading Drinks..."}]);

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
                    <div className="logo">mixd<DotColor toggleAdminMode={toggleAdminMode} /></div>
                </div>
            </header>
            {adminKey && <a href="#create"><AddDrinkEntry setCurrentPage={setCurrentPage}/></a>}
            {drinkList.map((drink) => {
                return <DrinkEntry admin={adminKey} drink={drink} setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink} getDrinkList={getDrinkList} adminKey={adminKey}/>
            })}
        </div>
        </>
    )
}

export default DrinkList;