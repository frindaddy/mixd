import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Logo from "../components/Logo";
import DrinkArray from "../components/DrinkList/DrinkArray";
import AddDrinkEntry from "../components/Admin/AddDrinkEntry";
import "../format/MenuPage.css";
import DoneEntry from "../components/Admin/DoneEntry";
const MenuPage = ({setShowLoader, user}) => {

    const { menu_id } = useParams();
    const { hash } = useLocation();
    const navigate = useNavigate();

    const [menu, setMenu] = useState({drinkList:[{name:"Loading Drinks..."}]});
    const [menuOrder, setMenuOrder] = useState([]);

    useEffect(() => {
        axios.get('/api/menu/'+menu_id)
            .then((res) => {
                if (res.data) {
                    setMenu(res.data);
                } else {
                    navigate('/404', {replace: true});
                }
            }).catch(() => {
            navigate('/404', {replace: true});
        });
    }, [menu_id, menuOrder]);

    return (
        <>
            {hash !=='#edit' && <Link to='/'>
                <Logo/>
            </Link>}
            <h1 className="menu-title">{menu.name || 'Menu'}</h1>
            <DrinkArray drinkList={menu.drinkList} filter={{text: "", tags: []}} setShowLoader={setShowLoader} menuSettings={{editMode: hash==='#edit', menu_id: menu.menu_id, menuOrder: menu.drinks, setMenuOrder: setMenuOrder}} isMenu={true} user={user}/>
            {hash==='#edit' && <div>
                <hr className="list-separator" />
                <Link to={'/account/edit_drinks/#edit_menu-'+menu.menu_id}><AddDrinkEntry /></Link>
                <hr className="list-separator" />
                <div onClick={()=>{navigate('/menu/'+menu.menu_id, {replace: true})}}><DoneEntry /></div>
            </div>}
        </>
    )
};

export default MenuPage;