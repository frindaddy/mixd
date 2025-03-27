import {useLocation} from "react-router-dom";
const MenuPage = () => {

    const { hash } = useLocation();

    return (
        <div>
            <h1>Menu</h1>
            <p>{'ID: '+hash}</p>
        </div>
    )
};

export default MenuPage;