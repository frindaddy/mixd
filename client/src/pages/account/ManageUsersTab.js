import React, {useEffect, useState} from "react"
import {FaKey, FaPlus, FaRegStar, FaStar, FaTrash, FaSearch} from "react-icons/fa";
import axios from "axios";
import '../../format/ManageUsersTab.css';
import '../../format/Tabs.css';

const ManageUsersTab = ({adminKey, user}) => {
    const [errorMsg, setErrorMsg] = useState('');
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        updateUsers();
    }, []);

    function updateUsers(){
        setErrorMsg('');
        axios.get('/api/users').then(res => {
            if(res.data){
                setUsers(res.data);
            }
        }).catch((err) => console.log(err));
    }

    function create_user() {
        axios.post('/api/create_user', {}, {
                headers: {
                    Authorization: `Bearer ${adminKey}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            if(res.data && res.data.user_id){
                setUsers([...users, {user_id: res.data.user_id}]);
            }
        }).catch((err) => {
            setErrorMsg('Failed to create user. Internal server error '+(err.response?.status || '500')+'.');
        });
    }

    function confirmDeleteUser(userToDelete) {
        if(window.confirm('Are you sure you want to delete user '+userToDelete.user_id + (userToDelete.username ? (' ('+userToDelete.username+')'):'')+'?') === true){
            axios.delete('/api/user/'+userToDelete.user_id, {headers:{Authorization: `Bearer ${adminKey}`}})
                .then(() => {
                    setUsers(users.filter(user_entry => user_entry.user_id !== userToDelete.user_id));
                }).catch((err) => {
                setErrorMsg('Failed to delete user. Internal server error '+(err.response?.status || '500')+'.');
            });
        }
    }

    function confirmResetPin(userToDelete) {
        if(window.confirm('Are you sure you want to reset the PIN for user '+userToDelete.user_id + (userToDelete.username ? (' ('+userToDelete.username+')'):'')+'?') === true){
            axios.delete('/api/pin/'+userToDelete.user_id, {headers:{Authorization: `Bearer ${adminKey}`}})
                .then(() => {
                    alert(userToDelete.user_id + (userToDelete.username ? (' ('+userToDelete.username+')'):'')+' PIN reset.');
                }).catch((err) => {
                setErrorMsg('Failed to update PIN. Internal server error '+(err.response?.status || '500'));
            });
        }
    }

    function changeAdmin(editUser, newStatus) {
        if(editUser.user_id+'' !== user.user_id+''){
            axios.post('/api/make_admin', {user_id: editUser.user_id, admin: newStatus}, {
                    headers: {
                        Authorization: `Bearer ${adminKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            ).then(res => {
                if(res.status === 200){
                    updateUsers();
                }
            }).catch((err) => {
                setErrorMsg('Failed to edit user. Internal server error '+(err.response?.status || '500')+'.');
            });
        } else {
            setErrorMsg('You cannot demote yourself.')
        }
    }

    const filteredUsers = users.filter(u => 
        u.user_id.toString().includes(searchTerm.toLowerCase()) || 
        (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const admins = filteredUsers.filter(u => u.admin);
    const regularUsers = filteredUsers.filter(u => !u.admin);

    const UserRow = ({userEntry}) => (
        <div className="user-row">
            <span className="user-info">
                {userEntry.user_id} {userEntry.username ? `(${userEntry.username})` : ''}
            </span>
            <div className="action-buttons">
                {userEntry.admin ? (
                    <FaStar className="action-icon star filled" onClick={() => changeAdmin(userEntry, false)} title="Demote from Admin" />
                ) : (
                    <FaRegStar className="action-icon star" onClick={() => changeAdmin(userEntry, true)} title="Promote to Admin" />
                )}
                <FaKey className="action-icon key" onClick={() => confirmResetPin(userEntry)} title="Reset PIN" />
                <FaTrash className="action-icon delete" onClick={() => confirmDeleteUser(userEntry)} title="Delete User" />
            </div>
        </div>
    );

    return (
        <div className="manage-users-tab">
            <h1 className="tab-title">Manage Users</h1>
            {errorMsg && <p className="error-msg">{"ERROR: " + errorMsg}</p>}
            
            <div className="add-user-section">
                <div className="manage-users-row">
                    <button className="add-button" onClick={create_user}>
                        <FaPlus className="add-icon" /><span className="button-text">Create New User</span>
                    </button>
                </div>
            </div>

            <div className="users-list-section">
                <div className="search-container">
                    <div className="search-bar-wrapper">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {admins.length > 0 && (
                    <div className="user-group">
                        <h2 className="user-group-header">Administrators</h2>
                        {admins.map(u => <UserRow key={u.user_id} userEntry={u} />)}
                    </div>
                )}

                {regularUsers.length > 0 && (
                    <div className="user-group">
                        <h2 className="user-group-header">Users</h2>
                        {regularUsers.map(u => <UserRow key={u.user_id} userEntry={u} />)}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageUsersTab;