import './format/Tags.css';
import './format/App.css';
import './format/Navbar.css';
import DrinkList from "./components/DrinkList/DrinkList";
import React, { useState,  useEffect } from "react";
import DrinkInfo from "./components/DrinkInfo/DrinkInfo";
import CreateDrink from "./components/Admin/CreateDrink";
import ManageIngredients from "./components/Admin/ManageIngredients";
import ViewIngredients from "./components/Ingredients/ViewIngredients";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import PageFrame from "./pages/PageFrame";
import Page404 from "./pages/Page404";

function App() {
    const [currentPage, setCurrentPage] = useState("drinkList");
    const [currentDrink, setCurrentDrink] = useState("");
    const [previousDrinkList, setPreviousDrinkList] = useState([{name:"Loading Drinks..."}]);
    const [searchText, setSearchText] = useState("");
    const [ingrFilter, setIngrFilter] = useState(["",""]);
    const [adminKey, setAdminKey] = useState();

    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<PageFrame />}>
                <Route index element={<DrinkList setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink} searchText={searchText} setSearchText={setSearchText} adminKey={adminKey} setAdminKey={setAdminKey} previousDrinkList={previousDrinkList} setPreviousDrinkList={setPreviousDrinkList} ingrFilter={ingrFilter} setIngrFilter={setIngrFilter}/>}/>
                <Route path="drink" element={<DrinkInfo drinkID={currentDrink} setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink}/>}/>
                <Route path="create_drink" element={<CreateDrink setCurrentPage={setCurrentPage} drinkID={null} adminKey={adminKey}/>}/>
                <Route path="update_drink" element={<CreateDrink setCurrentPage={setCurrentPage} drinkID={currentDrink} adminKey={adminKey}/>}/>
                <Route path="manage_ingredients" element={<ManageIngredients setCurrentPage={setCurrentPage} adminKey={adminKey}/>}/>
                <Route path="view_ingredients" element={<ViewIngredients setCurrentPage={setCurrentPage} setIngrFilter={setIngrFilter}/>}/>
                <Route path="*" element={<Page404 />} />
            </Route>
        </Routes>
    </BrowserRouter>
    );
}

export default App;
