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
import Layout from "./pages/Layout";
import Page404 from "./pages/Page404";

function App() {
    const [previousDrinkList, setPreviousDrinkList] = useState([{name:"Loading Drinks..."}]);
    const [searchText, setSearchText] = useState("");
    const [ingrFilter, setIngrFilter] = useState(["",""]);
    const [adminKey, setAdminKey] = useState();

    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<DrinkList searchText={searchText} setSearchText={setSearchText} adminKey={adminKey} setAdminKey={setAdminKey} previousDrinkList={previousDrinkList} setPreviousDrinkList={setPreviousDrinkList} ingrFilter={ingrFilter} setIngrFilter={setIngrFilter}/>}/>
                <Route path="drink/:uuid" element={<DrinkInfo />}/>
                <Route path="create_drink" element={<CreateDrink adminKey={adminKey}/>}/>
                <Route path="update_drink/:uuid" element={<CreateDrink adminKey={adminKey}/>}/>
                <Route path="manage_ingredients" element={<ManageIngredients adminKey={adminKey}/>}/>
                <Route path="view_ingredients" element={<ViewIngredients setIngrFilter={setIngrFilter}/>}/>
                <Route path="*" element={<Page404 />} />
            </Route>
        </Routes>
    </BrowserRouter>
    );
}

export default App;
