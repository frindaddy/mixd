import React, {useEffect, useState} from "react";
import axios from "axios";
import {FaCheck, FaEdit, FaPlus, FaTrash} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {FaX} from "react-icons/fa6";

const MenusTab = ({user}) => {

    const [menus, setMenus] = useState([]);
    const [drinkList, setDrinkList] = useState([]);
    const [creatingMenu, setCreatingMenu] = useState(false);
    const [newMenuName, setNewMenuName] = useState('');
    const [renameIndex, setRenameIndex] = useState(-1);

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/menus/'+user.user_id).then(res => {
            if(res.data){
                setMenus(res.data);
            }
        }).catch(err => console.error(err));
    }, [user.user_id]);

    useEffect(() => {
        axios.get('/api/list/').then(res => {
            if(res.data){
                setDrinkList(res.data);
            }
        }).catch(err => console.error(err));
    }, []);

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

    function startDrinkCreation(){
        if(!creatingMenu && renameIndex < 0){
            setCreatingMenu(true);
        }
    }
    function cancelCreate(){
        setCreatingMenu(false);
        setNewMenuName('');
    }

    function createMenu() {
        axios.post('/api/create_menu', {user_id: user.user_id, name:newMenuName}).then((res)=>{
            if(res.data){
                let new_menus= [...menus, {menu_id: res.data.menu_id, name:newMenuName, drinks:[]}];
                setMenus(new_menus);
                setNewMenuName('');
                setCreatingMenu(false);
            }
        })
    }

    function startRename(current_name, menu_index) {
        if(!creatingMenu){
            setNewMenuName(current_name || '');
            setRenameIndex(menu_index);
        }
    }

    function cancelRename() {
        setRenameIndex(-1);
        setNewMenuName('');
    }

    function renameMenu(menu_id, menu_index) {
        if(newMenuName !== '' && menu_id){
            axios.post('/api/modify_menu', {menu_id: menu_id, name: newMenuName}).then((res)=>{
                console.log(res);
                let new_menus = [...menus];
                new_menus[menu_index].name = newMenuName;
                setMenus(new_menus);
                setRenameIndex(-1);
                setNewMenuName('');
            });
        } else {
            cancelRename();
        }
    }

    return (
        <div>
            <div>
                {menus.map((menu, menu_index) => {
                    return <div style={{width: '200px', height: '200px', float:'left', padding:'10px', margin: '10px', backgroundColor:"gray", borderRadius: '10px', cursor:'pointer'}}>
                        {renameIndex >= 0 && renameIndex === menu_index && <div>
                            <input style={{width:'140px', border: 'none', outline:'none', fontSize: '16px', backgroundColor: 'darkgray'}} name='rename' value={newMenuName} onChange={(e)=>setNewMenuName(e.target.value)}/>
                            <FaCheck style={{float:'right'}} onClick={()=>{renameMenu(menu.menu_id, menu_index)}}/>
                            <FaX style={{marginRight: '10px', float:'right'}} onClick={cancelRename}/>
                        </div>}
                        {renameIndex !== menu_index && <div>
                            <span onClick={()=>navigate('/menu/'+menu.menu_id)}>{menu.name || "Menu " + menu.menu_id}</span>
                            <FaTrash style={{float: 'right'}} onClick={()=>confirmDeleteMenu(menu.menu_id, menu.name)}/>
                            <FaEdit style={{float: 'right', marginRight:'10px'}} onClick={()=> startRename(menu.name, menu_index)}/>
                        </div>}
                        <div onClick={()=>navigate('/menu/'+menu.menu_id+'#edit')}>
                            {menu.drinks.map(drink => {
                                let filtered_drinks = drinkList.filter(d=>d.uuid == drink)
                                if(filtered_drinks.length === 1 && filtered_drinks[0].glass){
                                    return <img style={{height:'65px'}} src={'/api/image?file=glassware/'+filtered_drinks[0].glass.toLowerCase()+'.svg&backup=glassware/unknown.svg'} alt={filtered_drinks[0].glass+' glass'}/>
                                }
                            })}
                        </div>
                        {menu.drinks && menu.drinks.length === 0 && <p>No drinks yet!</p>}
                    </div>
                })}
                <div style={{width: '200px', height: '200px', float:'left', padding:'10px', margin: '10px', backgroundColor:"gray", borderRadius: '10px', cursor: creatingMenu ? '':'pointer'}} onClick={startDrinkCreation}>
                    {!creatingMenu && <FaPlus style={{fontSize:'40px', left:'80px', top:'80px', position:"relative"}} />}
                    {creatingMenu && <div>
                        <input name='name' style={{backgroundColor: 'darkgray', border: 'none', outline:'none', fontSize: '16px'}} value={newMenuName} onChange={(e)=>setNewMenuName(e.target.value)}/>
                        <FaX style={{marginRight: '10px', cursor:'pointer'}} onClick={cancelCreate}/>
                        <FaCheck style={{cursor:'pointer'}} onClick={createMenu}/>
                    </div>}
                    <></>
                </div>
            </div>
        </div>
    )
};

export default MenusTab;