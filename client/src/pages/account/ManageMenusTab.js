import React, {useEffect, useState} from "react"
import {FaPlus, FaRegStar, FaStar, FaTrash} from "react-icons/fa";
import axios from "axios";
import '../../format/ManageIngredientsTab.css';

const ManageMenusTab = ({adminKey, user}) => {
    const [errorMsg, setErrorMsg] = useState('');
    const [users, setUsers] = useState([])
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        axios.get('/api/users').then(res => {
            if(res.data){
                setUsers(res.data);
            }
        }).catch((err) => console.log(err));
        updateMenus();
    }, []);

    function updateMenus(){
        setErrorMsg('');
        axios.get('/api/menus').then(res => {
            if(res.data){
                setMenus(res.data);
            }
        }).catch((err) => console.log(err));
    }

    function confirmDeleteMenu(menuToDelete) {
        if(window.confirm('Are you sure you want to force-delete menu "'+(menuToDelete.name || menuToDelete.menu_id) + '" by ' + getUsername(menuToDelete.users) + '?') === true){
            axios.delete('/api/menu_forced/'+menuToDelete.menu_id, {headers:{Authorization: `Bearer ${adminKey}`}})
                .then(() => {
                    setMenus(menus.filter(menu => menu.menu_id !== menuToDelete.menu_id));
                }).catch((err) => {
                setErrorMsg('Failed to delete menu. Internal server error '+err.response.status);
            });
        } else {
            alert('Menu not deleted.');
        }
    }

    function setFeatured(menu_id, remove) {
        axios.post('/api/feature_menu', {menu_id: menu_id, remove: remove}, {
                headers: {
                    Authorization: `Bearer ${adminKey}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            if(res.status === 200){
                updateMenus();
            } else {
                console.log(res);
            }
        }).catch((err) => {
            setErrorMsg('Failed to edit menu. Internal server error '+err.response.status);
        });
    }

    function getUsername(menu_users) {
        if(menu_users && menu_users.length >= 1) {
            let user_search = users.filter(user => user.user_id == menu_users[0]);
            if(user_search.length >= 1) {
                if(user_search[0].username) return user_search[0].username;
            }
            return menu_users[0];
        }
        return null;
    }

    return (
        <div>
            <h1 className="manage-ingredients-title" style={{marginTop:"20px", marginBottom:"-10px"}}>Manage Menus</h1>
            {errorMsg && <p>{errorMsg}</p>}
            {menus.map((menuEntry) =>{
                return <div>
                    <div style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
                        <span className="manage-ingredients-entry">{menuEntry.name || menuEntry.menu_id}</span>
                        <span style={{fontSize: '14px', marginLeft: '5px'}} className="manage-ingredients-entry">{getUsername(menuEntry.users)}</span>
                        {menuEntry.featured && <FaStar style={{cursor:'pointer', marginLeft:'8px'}} onClick={()=>{setFeatured(menuEntry.menu_id, true)}}/>}
                        {!menuEntry.featured && <FaRegStar style={{cursor:'pointer', marginLeft:'8px'}} onClick={()=>{setFeatured(menuEntry.menu_id, false)}}/>}
                        <FaTrash style={{marginLeft:'10px', cursor:'pointer'}} onClick={()=>{confirmDeleteMenu(menuEntry)}}/>
                    </div>
                </div>
            })}
        </div>
    )
}

export default ManageMenusTab;