import React, {useEffect, useState} from "react"
import {FaPlus, FaRegStar, FaStar, FaTrash} from "react-icons/fa";
import axios from "axios";
import '../../format/ManageIngredients.css';

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
//(userEntry.username ? (' ('+userEntry.username+')'):'')
    return (
        <div>
            <h1 className="manage-ingredients-title" style={{marginTop:"20px", marginBottom:"-10px"}}>Manage Menus</h1>
            {errorMsg && <p>{errorMsg}</p>}
            {menus.map((menuEntry) =>{
                return <div>
                    <div style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
                        <span className="manage-ingredients-entry">{menuEntry.menu_id}</span>
                        {menuEntry.featured && <FaStar style={{cursor:'pointer', marginLeft:'8px'}} onClick={()=>{setFeatured(menuEntry.menu_id, true)}}/>}
                        {!menuEntry.featured && <FaRegStar style={{cursor:'pointer', marginLeft:'8px'}} onClick={()=>{setFeatured(menuEntry.menu_id, false)}}/>}
                    </div>
                </div>
            })}
        </div>
    )
}

export default ManageMenusTab;