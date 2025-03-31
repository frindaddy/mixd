import React, {useEffect, useState} from "react";
import axios from "axios";
import {FaCheck, FaPlus} from "react-icons/fa";
import {FaX} from "react-icons/fa6";
import MenuCard from "../../components/Admin/MenuCard";

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
        axios.post('/api/create_menu', {user_id: user.user_id, name:newMenuName}).then((res)=>{
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
    }

    return (
        <div>
            <div>
                {menus.map((menu, menu_index) => {
                    return <MenuCard menu={menu} menu_index={menu_index} drinkList={drinkList} menus={menus} setMenus={setMenus} />
                })}
                <div style={{width: '200px', height: '200px', float:'left', padding:'10px', margin: '10px', backgroundColor:"gray", borderRadius: '10px', cursor: creatingMenu ? '':'pointer'}} onClick={startDrinkCreation}>
                    {!creatingMenu && <FaPlus style={{fontSize:'40px', left:'80px', top:'80px', position:"relative"}} />}
                    {creatingMenu && <div>
                        <input name='name' style={{backgroundColor: 'darkgray', border: 'none', outline:'none', fontSize: '16px'}} value={newMenuName} onChange={(e)=>setNewMenuName(e.target.value)} onKeyDown={checkEnter}/>
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