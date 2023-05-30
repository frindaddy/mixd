import './format/tags.css';
import './format/mixd.css';
import DrinkList from "./components/DrinkList/DrinkList";
import React, { useState,  useEffect } from "react";
import DrinkInfo from "./components/DrinkInfo/DrinkInfo";
import CreateDrink from "./components/Admin/CreateDrink";


function App() {
    const [currentPage, setCurrentPage] = useState("drinkList");
    const [currentDrink, setCurrentDrink] = useState("");

    useEffect(() =>{
        window.addEventListener('hashchange', (hash)=>{
            switch(window.location.hash){
                case "#drink":
                    setCurrentPage('drinkInfo');
                    break;
                default:
                    setCurrentPage('drinkList');
                    break;
            }
        });
    }, []);

    return (
    <div className="App">
        {currentPage === "drinkList" && <DrinkList setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink}/>}
        {currentPage === "drinkInfo" && <DrinkInfo drinkID={currentDrink} setCurrentPage={setCurrentPage}/>}
        {currentPage === "createDrink" && <CreateDrink setCurrentPage={setCurrentPage}/>}
        <footer>
            <p>©2023 by Jacob Thweatt and Trevor Sides. All Rights Reserved.<br/>
                Powered by our pure genius.</p>
        </footer>
    </div>
    );
}

export default App;
