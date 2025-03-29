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
                <Route index element={<DrinkList setShowLoader={setShowLoader} searchText={searchText} setSearchText={setSearchText} user={user} previousDrinkList={previousDrinkList} setPreviousDrinkList={setPreviousDrinkList} ingrFilter={ingrFilter} setIngrFilter={setIngrFilter} userDrinksReq={userDrinksReq} setUserDrinksReq={setUserDrinksReq} />}/>
                <Route path=":drink_identifier" element={<DrinkInfo setShowLoader={setShowLoader}/>}/>
                <Route path="create_drink" element={<CreateDrink adminKey={user.adminKey}/>}/>
                <Route path="update_drink/:uuid" element={<CreateDrink adminKey={user.adminKey}/>}/>
                <Route path="account" element={<AccountPage setIngrFilter={setIngrFilter} setUserDrinksReq={setUserDrinksReq} user={user} setUser={setUser} />} />
                <Route path="account/login" element={<LoginPage user={user} setUser={setUser} />}/>
                <Route path="menu/:menu_id" element={<MenuPage setShowLoader={setShowLoader}/>}/>
                <Route path="404" element={<Page404 />} />
            </Route>
        </Routes>
    </BrowserRouter>
    );
}

export default App;
