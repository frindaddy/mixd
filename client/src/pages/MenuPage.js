import {useLocation, useParams} from "react-router-dom";
const MenuPage = () => {

    const { menu_id } = useParams();

    return (
        <div>
            <h1>Menu</h1>
            <p>{'ID: '+menu_id}</p>
        </div>
    )
};

export default MenuPage;