import React, {useEffect, useState} from "react"
import {FaRegStar, FaStar, FaTrash, FaSearch} from "react-icons/fa";
import axios from "axios";
import '../../format/ManageMenusTab.css';
import '../../format/Tabs.css';

const ManageMenusTab = ({adminKey, user}) => {
    const [errorMsg, setErrorMsg] = useState('');
    const [users, setUsers] = useState([])
    const [menus, setMenus] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

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
                setErrorMsg('Failed to delete menu. Internal server error '+(err.response?.status || '500')+".");
            });
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
            }
        }).catch((err) => {
            setErrorMsg('Failed to edit menu. Internal server error '+(err.response?.status || '500')+".");
        });
    }

    function getUsername(menu_users) {
        if(menu_users && menu_users.length >= 1) {
            let user_search = users.filter(u => u.user_id.toString() === menu_users[0].toString());
            if(user_search.length >= 1) {
                if(user_search[0].username) return user_search[0].username;
            }
            return menu_users[0];
        }
        return "Unknown User";
    }

    const filteredMenus = menus.filter(m => {
        const username = getUsername(m.users).toLowerCase();
        const menuName = (m.name || m.menu_id).toLowerCase();
        const search = searchTerm.toLowerCase();
        return menuName.includes(search) || username.includes(search);
    });

    const featuredMenus = filteredMenus.filter(m => m.featured);
    const otherMenus = filteredMenus.filter(m => !m.featured);

    const MenuRow = ({menuEntry}) => (
        <div className="menu-row">
            <div className="menu-info">
                <span className="menu-name">{menuEntry.name || menuEntry.menu_id}</span>
                <span className="menu-owner">{getUsername(menuEntry.users)}</span>
            </div>
            <div className="action-buttons">
                {menuEntry.featured ? (
                    <FaStar className="action-icon star filled" onClick={() => setFeatured(menuEntry.menu_id, true)} title="Unfeature Menu" />
                ) : (
                    <FaRegStar className="action-icon star" onClick={() => setFeatured(menuEntry.menu_id, false)} title="Feature Menu" />
                )}
                <FaTrash className="action-icon delete" onClick={() => confirmDeleteMenu(menuEntry)} title="Force Delete Menu" />
            </div>
        </div>
    );

    return (
        <div className="manage-menus-tab">
            <h1 className="tab-title">Manage Menus</h1>
            {errorMsg && <p className="error-msg">{"ERROR: " + errorMsg}</p>}
            
            <div className="menus-list-section">
                <div className="search-container">
                    <div className="search-bar-wrapper">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search menus..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {featuredMenus.length > 0 && (
                    <div className="menu-group">
                        <h2 className="menu-group-header">Featured Menu</h2>
                        {featuredMenus.map(m => <MenuRow key={m.menu_id} menuEntry={m} />)}
                    </div>
                )}

                {otherMenus.length > 0 && (
                    <div className="menu-group">
                        <h2 className="menu-group-header">Other Menus</h2>
                        {otherMenus.map(m => <MenuRow key={m.menu_id} menuEntry={m} />)}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageMenusTab;