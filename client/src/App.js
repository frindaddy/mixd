import './format/Tags.css';
import './format/App.css';
import './format/Navbar.css';
import DrinkList from "./components/DrinkList/DrinkList";
import React, { useState,  useEffect } from "react";
import DrinkInfo from "./components/DrinkInfo/DrinkInfo";
import CreateDrink from "./components/Admin/CreateDrink";
import axios from "axios";
import ManageIngredients from "./components/Admin/ManageIngredients";
import Ingredients from "./components/Ingredients/Ingredients";

let currentYear = new Date().getFullYear();

function App() {
    const [appInfo, setAppInfo] = useState({});
    const [currentPage, setCurrentPage] = useState("drinkList");
    const [currentDrink, setCurrentDrink] = useState("");
    const [previousDrinkList, setPreviousDrinkList] = useState([{name:"Loading Drinks..."}]);
    const [searchText, setSearchText] = useState("");
    const [ingrFilter, setIngrFilter] = useState(["",""]);
    const [adminKey, setAdminKey] = useState();

    useEffect(() => {
        axios.get('api/app-info')
            .then((res) => {
                if (res.data) {
                    setAppInfo(res.data);
                }
            }).catch((err) => console.log(err));
    }, []);

    return (
    <div className="App">
        {currentPage === "drinkList" && <DrinkList setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink} searchText={searchText} setSearchText={setSearchText} adminKey={adminKey} setAdminKey={setAdminKey} previousDrinkList={previousDrinkList} setPreviousDrinkList={setPreviousDrinkList} ingrFilter={ingrFilter} setIngrFilter={setIngrFilter}/>}
        {currentPage === "drinkInfo" && <DrinkInfo drinkID={currentDrink} setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink}/>}
        {currentPage === "createDrink" && <CreateDrink setCurrentPage={setCurrentPage} drinkID={null} adminKey={adminKey}/>}
        {currentPage === "updateDrink" && <CreateDrink setCurrentPage={setCurrentPage} drinkID={currentDrink} adminKey={adminKey}/>}
        {currentPage === "manageIngredients" && <ManageIngredients setCurrentPage={setCurrentPage} adminKey={adminKey}/>}
        {currentPage === "Ingredients" && <Ingredients setCurrentPage={setCurrentPage} setIngrFilter={setIngrFilter}/>}
        <footer>
            <p>©{currentYear} by Jacob Thweatt and Trevor Sides. All Rights Reserved.<br/>
                Powered by our pure genius.<br/>
                v{appInfo.version}</p>
        </footer>
    </div>
    );
}

export default App;
