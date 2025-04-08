import './format/Tags.css';
import './format/App.css';
import DrinkList from "./pages/DrinkList";
import {useEffect, useState} from "react";
import DrinkInfo from "./pages/DrinkInfo";
import CreateDrink from "./pages/CreateDrink";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout";
import Page404 from "./pages/Page404";
import LoginPage from "./pages/account/LoginPage";
import AccountPage from "./pages/account/AccountPage";
import MenuPage from "./pages/MenuPage";
import MyBarTab from "./pages/account/MyBarTab";
import MenusTab from "./pages/account/MyMenusTab";
import MyAccountTab from "./pages/account/MyAccountTab";
import ManageIngredientsTab from "./pages/account/ManageIngredientsTab";
import ManageUsersTab from "./pages/account/ManageUsersTab";
import StatisticsTab from "./pages/account/StatisticsTab";
import ManageDrinksTab from "./pages/account/ManageDrinksTab";
import ManageMenusTab from "./pages/account/ManageMenusTab";
import {useCookies} from "react-cookie";

function App() {
    const [searchText, setSearchText] = useState('');
    const [searchTags, setSearchTags] = useState([]);
    const [searchIngredient, setSearchIngredient] = useState('');
    const [myBarSearch, setMyBarSearch] = useState({});
    const [user, setUser] = useState({});
    const [showLoader, setShowLoader] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    useEffect(()=> {
        if(cookies['user'] && cookies['user'].user_id && !user.user_id){
            setUser(cookies['user']);
        }
    }, []);

    return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Layout showLoader={showLoader} setShowLoader={setShowLoader} user={user} setUser={setUser} removeCookie={removeCookie} />}>
                <Route index element={<DrinkList setShowLoader={setShowLoader} searchText={searchText} setSearchText={setSearchText} user={user} setUser={setUser} searchIngredient={searchIngredient} setSearchIngredient={setSearchIngredient} searchTags={searchTags} setSearchTags={setSearchTags} myBarSearch={myBarSearch} setMyBarSearch={setMyBarSearch} removeCookie={removeCookie}/>}/>
                <Route path=":drink_identifier" element={<DrinkInfo setShowLoader={setShowLoader}/>}/>
                <Route path="create_drink" element={<CreateDrink adminKey={user.token}/>}/>
                <Route path="update_drink/:uuid" element={<CreateDrink adminKey={user.token}/>}/>
                <Route path="account" element={<AccountPage user={user}/>} >
                    <Route index element={<MyAccountTab user={user} setUser={setUser} removeCookie={removeCookie} />}></Route>
                    <Route path="bar" element={<MyBarTab setMyBarSearch={setMyBarSearch} user={user} />}></Route>
                    <Route path="menus" element={<MenusTab user={user}/>}></Route>
                    <Route path="statistics" element={<StatisticsTab setSearchIngredient={setSearchIngredient}/>}></Route>
                    <Route path="edit_ingredients" element={<ManageIngredientsTab adminKey={user.token} />}></Route>
                    <Route path="edit_drinks" element={<ManageDrinksTab user={user} setShowLoader={setShowLoader}/>}></Route>
                    <Route path="edit_menus" element={<ManageMenusTab adminKey={user.token} user={user}/>}></Route>
                    <Route path="users" element={<ManageUsersTab adminKey={user.token} user={user}/>}></Route>
                </Route>
                <Route path="account/login" element={<LoginPage user={user} setUser={setUser} setCookie={setCookie}/>}/>
                <Route path="menu/:menu_id" element={<MenuPage setShowLoader={setShowLoader} user={user}/>}/>
                <Route path="404" element={<Page404 />} />
            </Route>
        </Routes>
    </BrowserRouter>
    );
}

export default App;
