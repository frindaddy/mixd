import {useEffect, useState} from "react";
import axios from "axios";

const MenusTab = ({user}) => {

    const [menus, setMenus] = useState([]);

    useEffect(() => {
        axios.get('/api/menus/'+user.user_id).then(res => {
            if(res.data){
                setMenus(res.data);
            }
        });
    }, [user.user_id]);

    return (
        <div>
            <p>Menus:</p>
            {menus.map(menu => {
                return <p>{menu.menu_id}</p>
            })}
        </div>
    )
};

export default MenusTab;