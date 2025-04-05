import React, {useEffect, useState} from "react";
import axios from "axios";
import {FaCheck, FaPlus} from "react-icons/fa";
import {FaX} from "react-icons/fa6";
import MenuCard from "../../components/Admin/MenuCard";
import "../../format/MenuCard.css"
import "../../format/Tabs.css"

const MenusTab = ({user}) => {

    const [menus, setMenus] = useState([]);
    const [drinkList, setDrinkList] = useState([]);
    const [creatingMenu, setCreatingMenu] = useState(false);
    const [newMenuName, setNewMenuName] = useState('');

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

    function startDrinkCreation(){
        if(!creatingMenu){
            setCreatingMenu(true);
        }
    }
    function cancelCreate(){
        setCreatingMenu(false);
        setNewMenuName('');
    }

    function createMenu() {
        axios.post('/api/create_menu', {user_id: user.user_id, name:newMenuName}, {headers:{Authorization: `Bearer ${user.token}`}}).then((res)=>{
            if(res.data){
                let new_menus= [...menus, {menu_id: res.data.menu_id, name:newMenuName, drinks:[]}];
                setMenus(new_menus);
                setNewMenuName('');
                setCreatingMenu(false);
            }
        })
    }
    function checkEnter(e) {
        if(e.code === "Enter" || e.code === "NumpadEnter") createMenu();
        if(e.code === "Escape") cancelCreate();
    }

    return (
        <>
            <h1 className="tab-title">My Menus</h1>
            <div style={{display:"flex", flexFlow:"row wrap", justifyContent:"center"}}>
                {menus.map((menu, menu_index) => {
                    return <MenuCard menu={menu} menu_index={menu_index} drinkList={drinkList} menus={menus} setMenus={setMenus} user={user}/>
                })}
                <div className="menu-card" style={{cursor: creatingMenu ? '':'pointer'}} onClick={startDrinkCreation}>
                    {!creatingMenu && <FaPlus style={{fontSize:'40px', left:"40%", top:"40%", position:"relative"}} />}
                    {creatingMenu && <div style={{display:"flex", alignItems:"center"}}>
                        <input autoFocus name='name' className="menu-card-title-input" value={newMenuName} onChange={(e)=>setNewMenuName(e.target.value)} onKeyDown={checkEnter}/>
                        <FaX className="menu-card-title-button" onClick={cancelCreate}/>
                        <FaCheck className="menu-card-title-button" onClick={createMenu}/>
                    </div>}
                </div>
            </div>
        </>
    )
};

export default MenusTab;