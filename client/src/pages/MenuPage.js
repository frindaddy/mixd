import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import DrinkArray from "../components/DrinkList/DrinkArray";
import AddDrinkEntry from "../components/Admin/AddDrinkEntry";
const MenuPage = ({setShowLoader}) => {

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
            <h1>{menu.name || 'Menu'}</h1>
            <DrinkArray drinkList={menu.drinkList} filter={{text: "", tags: [], glasses: []}} setShowLoader={setShowLoader} menuSettings={{editMode: hash==='#edit', menu_id: menu.menu_id, menuOrder: menu.drinks, setMenuOrder: setMenuOrder}} showMenuDesc={true}/>
            {hash==='#edit' && <div>
                <hr className="list-separator" />
                <Link to={'/#edit_menu-'+menu.menu_id}><AddDrinkEntry /></Link>
            </div>}
        </>
    )
};

export default MenuPage;