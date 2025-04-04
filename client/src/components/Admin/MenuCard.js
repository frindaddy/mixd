import React, {useState} from "react"
import {FaCheck, FaEdit, FaTrash} from "react-icons/fa";
import "../../format/DrinkList.css";
import {FaX} from "react-icons/fa6";
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
        <div style={{width: '200px', height: '200px', float:'left', padding:'10px', margin: '10px', backgroundColor:"gray", borderRadius: '10px', cursor:'pointer'}}>
            {currentlyRenaming && <div>
                <input autoFocus style={{width:'140px', border: 'none', outline:'none', fontSize: '16px', backgroundColor: 'darkgray'}} name='rename' value={newMenuName} onChange={(e)=>setNewMenuName(e.target.value)} onKeyDown={checkEnter}/>
                <FaCheck style={{float:'right'}} onClick={renameMenu}/>
                <FaX style={{marginRight: '10px', float:'right'}} onClick={cancelRename}/>
            </div>}
            {!currentlyRenaming && <div>
                <span onClick={()=>navigate('/menu/'+menu.menu_id)}>{menu.name || "Menu " + menu.menu_id}</span>
                <FaTrash style={{float: 'right'}} onClick={()=>confirmDeleteMenu(menu.menu_id, menu.name)}/>
                <FaEdit style={{float: 'right', marginRight:'10px'}} onClick={startRename}/>
            </div>}
            <div onClick={()=>navigate('/menu/'+menu.menu_id+'#edit')}>
                {menu.drinks.map(drink => {
                    let filtered_drinks = drinkList.filter(d=>d.uuid === drink)
                    if(filtered_drinks.length === 1 && filtered_drinks[0].glass){
                        return <img style={{height:'65px'}} src={'/api/image?file=glassware/'+filtered_drinks[0].glass.toLowerCase()+'.svg&backup=glassware/unknown.svg'} alt={filtered_drinks[0].glass+' glass'}/>
                    }
                })}
            </div>
            {menu.drinks && menu.drinks.length === 0 && <p onClick={()=>navigate('/menu/'+menu.menu_id+'#edit')}>No drinks yet!</p>}
        </div>
    )
}

export default MenuCard;