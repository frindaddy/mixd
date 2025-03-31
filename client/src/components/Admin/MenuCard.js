import React, {useState} from "react"
import {FaCheck, FaEdit, FaTrash} from "react-icons/fa";
import "../../format/DrinkList.css";
import {FaX} from "react-icons/fa6";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const MenuCard = ({menu, menu_index, drinkList, menus, setMenus}) => {

    const [newMenuName, setNewMenuName] = useState('');
    const [currentlyRenaming, setCurrentlyRenaming] = useState(false);

    const navigate = useNavigate();

    function confirmDeleteMenu(menuID, menuName) {
        if(window.confirm('Are you sure you want to delete \''+(menuName || "Menu " + menuID)+'\'?') === true){
            axios.delete('/api/menu/'+menuID)
                .then((res) => {
                    setMenus(menus.filter(menu => menu.menu_id !== menuID));
                }).catch((err) => console.log(err));
        } else {
            alert('Ingredient not deleted.');
        }
    }

    function startRename(current_name) {
        setCurrentlyRenaming(true);
        setNewMenuName(current_name || '');
    }

    function cancelRename() {
        setNewMenuName('');
        setCurrentlyRenaming(false);
    }

    function renameMenu(menu_id, menu_index) {
        if(newMenuName !== '' && menu_id){
            axios.post('/api/modify_menu', {menu_id: menu_id, name: newMenuName}).then((res)=>{
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
                <input style={{width:'140px', border: 'none', outline:'none', fontSize: '16px', backgroundColor: 'darkgray'}} name='rename' value={newMenuName} onChange={(e)=>setNewMenuName(e.target.value)}/>
                <FaCheck style={{float:'right'}} onClick={()=>{renameMenu(menu.menu_id, menu_index)}}/>
                <FaX style={{marginRight: '10px', float:'right'}} onClick={cancelRename}/>
            </div>}
            {!currentlyRenaming && <div>
                <span onClick={()=>navigate('/menu/'+menu.menu_id)}>{menu.name || "Menu " + menu.menu_id}</span>
                <FaTrash style={{float: 'right'}} onClick={()=>confirmDeleteMenu(menu.menu_id, menu.name)}/>
                <FaEdit style={{float: 'right', marginRight:'10px'}} onClick={()=> startRename(menu.name)}/>
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