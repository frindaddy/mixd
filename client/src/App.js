import './format/Tags.css';
import './format/App.css';
import DrinkList from "./pages/DrinkList";
import React, { useState } from "react";
import DrinkInfo from "./pages/DrinkInfo";
import CreateDrink from "./pages/CreateDrink";
import ManageIngredients from "./pages/ManageIngredients";
import ViewIngredients from "./pages/ViewIngredients";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout";
import Page404 from "./pages/Page404";
import LoginPage from "./pages/account/LoginPage";
import AccountPage from "./pages/account/AccountPage";

function App() {
    const [previousDrinkList, setPreviousDrinkList] = useState([{name:"Loading Drinks..."}]);
    const [searchText, setSearchText] = useState("");
    const [ingrFilter, setIngrFilter] = useState(["",""]);
    const [userDrinksReq, setUserDrinksReq] = useState(null);
    const [user, setUser] = useState({});
    const [showLoader, setShowLoader] = useState(false);

    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout showLoader={showLoader} setShowLoader={setShowLoader}/>}>
                <Route index element={<DrinkList setShowLoader={setShowLoader} searchText={searchText} setSearchText={setSearchText} adminKey={user.adminKey} previousDrinkList={previousDrinkList} setPreviousDrinkList={setPreviousDrinkList} ingrFilter={ingrFilter} setIngrFilter={setIngrFilter} userDrinksReq={userDrinksReq} setUserDrinksReq={setUserDrinksReq} />}/>
                <Route path=":drink_identifier" element={<DrinkInfo setShowLoader={setShowLoader}/>}/>
                <Route path="create_drink" element={<CreateDrink adminKey={user.adminKey}/>}/>
                <Route path="update_drink/:uuid" element={<CreateDrink adminKey={user.adminKey}/>}/>
                <Route path="manage_ingredients" element={<ManageIngredients adminKey={user.adminKey}/>}/>
                <Route path="view_ingredients" element={<ViewIngredients setIngrFilter={setIngrFilter} setUserDrinksReq={setUserDrinksReq} user={user} setUser={setUser}/>}/>
                <Route path="account" element={<AccountPage user={user} setUser={setUser} />} />
                <Route path="account/login" element={<LoginPage user={user} setUser={setUser} />}/>
                <Route path="404" element={<Page404 />} />
            </Route>
        </Routes>
    </BrowserRouter>
    );
}

export default App;
