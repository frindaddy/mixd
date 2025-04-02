import './format/Tags.css';
import './format/App.css';
import DrinkList from "./pages/DrinkList";
import { useState } from "react";
import DrinkInfo from "./pages/DrinkInfo";
import CreateDrink from "./pages/CreateDrink";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout";
import Page404 from "./pages/Page404";
import LoginPage from "./pages/account/LoginPage";
import AccountPage from "./pages/account/AccountPage";
import MenuPage from "./pages/MenuPage";
import MyBarTab from "./pages/account/MyBarTab";
import MenusTab from "./pages/account/MenusTab";
import MyAccountTab from "./pages/account/MyAccountTab";
import ManageIngredientsTab from "./pages/account/ManageIngredientsTab";
import ManageUsersTab from "./pages/account/ManageUsersTab";
import StatisticsTab from "./pages/account/StatisticsTab";
import ManageDrinksTab from "./pages/account/ManageDrinksTab";

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
            <Route path="/" element={<Layout showLoader={showLoader} setShowLoader={setShowLoader} user={user} setUser={setUser}/>}>
                <Route index element={<DrinkList setShowLoader={setShowLoader} searchText={searchText} setSearchText={setSearchText} user={user} setUser={setUser} previousDrinkList={previousDrinkList} setPreviousDrinkList={setPreviousDrinkList} ingrFilter={ingrFilter} setIngrFilter={setIngrFilter} userDrinksReq={userDrinksReq} setUserDrinksReq={setUserDrinksReq} />}/>
                <Route path=":drink_identifier" element={<DrinkInfo setShowLoader={setShowLoader}/>}/>
                <Route path="create_drink" element={<CreateDrink adminKey={user.adminKey}/>}/>
                <Route path="update_drink/:uuid" element={<CreateDrink adminKey={user.adminKey}/>}/>
                <Route path="account" element={<AccountPage user={user}/>} >
                    <Route index element={<MyAccountTab user={user} setUser={setUser}/>}></Route>
                    <Route path="bar" element={<MyBarTab setUserDrinksReq={setUserDrinksReq} user={user} />}></Route>
                    <Route path="menus" element={<MenusTab user={user}/>}></Route>
                    <Route path="statistics" element={<StatisticsTab />}></Route>
                    <Route path="edit_ingredients" element={<ManageIngredientsTab adminKey={user.adminKey} />}></Route>
                    <Route path="edit_drinks" element={<ManageDrinksTab user={user} setShowLoader={setShowLoader}/>}></Route>
                    <Route path="users" element={<ManageUsersTab adminKey={user.adminKey} user={user}/>}></Route>
                </Route>
                <Route path="account/login" element={<LoginPage user={user} setUser={setUser} />}/>
                <Route path="menu/:menu_id" element={<MenuPage setShowLoader={setShowLoader}/>}/>
                <Route path="404" element={<Page404 />} />
            </Route>
        </Routes>
    </BrowserRouter>
    );
}

export default App;
