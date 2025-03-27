import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
const MenuPage = () => {

    const { menu_id } = useParams();
    const navigate = useNavigate();

    const [menu, setMenu] = useState({});

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
        </div>
    )
};

export default MenuPage;