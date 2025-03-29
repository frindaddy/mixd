import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import DrinkArray from "../components/DrinkList/DrinkArray";
const MenuPage = ({setShowLoader}) => {

    const { menu_id } = useParams();
    const { hash } = useLocation();
    const navigate = useNavigate();

    const [menu, setMenu] = useState({drinkList:[{name:"Loading Drinks..."}]});

    useEffect(() => {
        axios.get('/api/menu/'+menu_id)
            .then((res) => {
                if (res.data) {
                    setMenu(res.data)
                } else {
                    navigate('/404', {replace: true});
                }
            }).catch(() => {
            navigate('/404', {replace: true});
        });
    }, [menu_id]);

    return (
        <div>
            <h1>Menu</h1>
            <p>{'ID: '+menu.menu_id}</p>
            <DrinkArray drinkList={menu.drinkList} filter={{text: "", tags: [], glasses: []}} setShowLoader={setShowLoader} menuSettings={{editMode: hash==='#edit', menu: menu, setMenu: setMenu}}/>
        </div>
    )
};

export default MenuPage;