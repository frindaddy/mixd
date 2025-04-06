import React, {useState} from "react"
import {FaCheck, FaEdit, FaTrash} from "react-icons/fa";
import MenuCardDrinkEntry from "./MenuCardDrinkEntry";
import "../../format/MenuCard.css";
import {FaXmark} from "react-icons/fa6";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const MenuCard = ({menu, menu_index, drinkList, menus, setMenus, user}) => {

    const [newMenuName, setNewMenuName] = useState('');
    const [currentlyRenaming, setCurrentlyRenaming] = useState(false);

    const navigate = useNavigate();

    function confirmDeleteMenu() {
        if(window.confirm('Are you sure you want to delete \''+(menu.name || "Menu " + menu.menu_id)+'\'?') === true){
            axios.delete('/api/menu/'+menu.menu_id, {headers:{Authorization: `Bearer ${user.token}`}})
                .then((res) => {
                    setMenus(menus.filter(menu_entry => menu_entry.menu_id !== menu.menu_id));
                }).catch((err) => console.log(err));
        } else {
            alert('Menu not deleted.');
        }
    }

    function startRename() {
        setCurrentlyRenaming(true);
        setNewMenuName(menu.name || '');
    }

    function cancelRename() {
        setNewMenuName('');
        setCurrentlyRenaming(false);
    }

    function checkEnter(e) {
        if(e.code === "Enter" || e.code === "NumpadEnter") renameMenu();
        if(e.code === "Escape") cancelRename();
    }

    function renameMenu() {
        if(newMenuName !== '' && menu.menu_id){
            axios.post('/api/modify_menu', {menu_id: menu.menu_id, name: newMenuName}, {headers:{Authorization: `Bearer ${user.token}`}}).then((res)=>{
                if(res.status === 200){
                    let new_menus = [...menus];
                    new_menus[menu_index].name = newMenuName;
                    setMenus(new_menus);
                    setCurrentlyRenaming(false);
                    setNewMenuName('');
                }
            });
        } else {
            cancelRename();
        }
    }

    return (
        <div className="menu-card">
            {currentlyRenaming && <div className="menu-card-title-container">
                <input autoFocus className="menu-card-title-input" name='rename' value={newMenuName} onChange={(e)=>setNewMenuName(e.target.value)} onKeyDown={checkEnter}/>
                <FaCheck className="menu-card-title-button" onClick={renameMenu}/>
                <FaXmark className="menu-card-title-button" style={{fontSize:"20px"}} onClick={cancelRename}/>
            </div>}
            {!currentlyRenaming && <div className="menu-card-title-container">
                <span className="menu-card-title" onClick={()=>navigate('/menu/'+menu.menu_id+'#edit')}>{menu.name || "Menu " + menu.menu_id}</span>
                <FaTrash className="menu-card-title-button" onClick={()=>confirmDeleteMenu(menu.menu_id, menu.name)}/>
                <FaEdit className="menu-card-title-button" onClick={startRename}/>
            </div>}
            <div onClick={()=>navigate('/menu/'+menu.menu_id+'#edit')}>
                {menu.drinks.map((drink, i) => {
                    let filtered_drinks = drinkList.filter(d=>d.uuid === drink)
                    if(filtered_drinks.length === 1 && i <= 3 && filtered_drinks[0]){
                        return <MenuCardDrinkEntry drink={filtered_drinks[0]}/>
                    }
                    else if(filtered_drinks.length === 1 && i === 4 && filtered_drinks[0]){
                        return(
                            <>
                                <hr></hr>
                                <div className="menu-card-elipses">...</div>
                            </>
                        )
                    }
                    else{
                        return
                    }
                })}
            </div>
            {menu.drinks && menu.drinks.length === 0 && <p style={{textAlign:"center", fontWeight:"300"}} onClick={()=>navigate('/menu/'+menu.menu_id+'#edit')}>No drinks yet!</p>}
        </div>
    )
}

export default MenuCard;