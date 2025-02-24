import './format/Tags.css';
import './format/App.css';
import './format/Navbar.css';
import DrinkList from "./pages/DrinkList";
import React, { useState,  useEffect } from "react";
import DrinkInfo from "./components/DrinkInfo/DrinkInfo";
import CreateDrink from "./pages/CreateDrink";
import ManageIngredients from "./pages/ManageIngredients";
import ViewIngredients from "./pages/ViewIngredients";
import {HashRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout";
import Page404 from "./pages/Page404";

function App() {
    const [previousDrinkList, setPreviousDrinkList] = useState([{name:"Loading Drinks..."}]);
    const [searchText, setSearchText] = useState("");
    const [ingrFilter, setIngrFilter] = useState(["",""]);
    const [adminKey, setAdminKey] = useState();

    return (
    <HashRouter>
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
    </HashRouter>
    );
}

export default App;
