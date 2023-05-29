import './css/tags.css';
import './css/mixd.css';
import DrinkList from "./components/DrinkList/DrinkList";
import React, { useState, useEffect } from "react";
import DrinkInfo from "./components/DrinkInfo/DrinkInfo";


function App() {
    const [currentPage, setCurrentPage] = useState("drinkList");
    const [currentDrink, setCurrentDrink] = useState("");

    return (
    <div className="App">
        {currentPage == "drinkList" && <DrinkList setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink}/>}
        {currentPage == "drinkInfo" && <DrinkInfo drinkID={currentDrink} setCurrentPage={setCurrentPage}/>}
        <footer>
            <p>©2023 by Jacob Thweatt and Trevor Sides. All Rights Reserved.<br/>
                Powered by our pure genius.</p>
        </footer>
    </div>
    );
}

export default App;
