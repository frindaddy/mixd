import React, {useEffect, useState} from "react"
import {FaPlus, FaRegStar, FaStar, FaTrash} from "react-icons/fa";
import axios from "axios";
import '../../format/ManageIngredients.css';

const ManageUsersTab = ({adminKey, user}) => {
    const [errorMsg, setErrorMsg] = useState('');
    const [users, setUsers] = useState([]);

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
            setErrorMsg('Failed to create user. Internal server error '+err.response.status);
        });
    }

    function confirmDeleteUser(userToDelete) {
        if(window.confirm('Are you sure you want to delete user '+userToDelete.user_id + (userToDelete.username ? (' ('+userToDelete.username+')'):'')+'?') === true){
            axios.delete('/api/user/'+userToDelete.user_id, {headers:{Authorization: `Bearer ${adminKey}`}})
                .then(() => {
                    setUsers(users.filter(user_entry => user_entry.user_id !== userToDelete.user_id));
                }).catch((err) => {
                setErrorMsg('Failed to delete user. Internal server error '+err.response.status);
            });
        } else {
            alert('User not deleted.');
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
                } else {
                    console.log(res);
                }
            }).catch((err) => {
                setErrorMsg('Failed to edit user. Internal server error '+err.response.status);
            });
        } else {
            setErrorMsg('You cannot demote yourself.')
        }
    }

    return (
        <div>
            <h1 className="manage-ingredients-title" style={{marginTop:"20px", marginBottom:"-10px"}}>Manage Users</h1>
            {errorMsg && <p>{errorMsg}</p>}
            {users.map((userEntry) =>{
                return <div>
                    <div style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
                        <span className="manage-ingredients-entry">{userEntry.user_id + (userEntry.username ? (' ('+userEntry.username+')'):'')}</span>
                        {userEntry.admin && <FaStar style={{cursor:'pointer', marginLeft:'8px'}} onClick={()=>{changeAdmin(userEntry, false)}}/>}
                        {!userEntry.admin && <FaRegStar style={{cursor:'pointer', marginLeft:'8px'}} onClick={()=>{changeAdmin(userEntry, true)}}/>}
                        {typeof userEntry.user_id === "number" && <FaTrash style={{marginLeft:'10px', cursor:'pointer'}} onClick={()=>{confirmDeleteUser(userEntry)}}/>}
                    </div>
                </div>
            })}
            <div style={{display: "flex", justifyContent: "center", alignItems:"center", marginTop:"10px"}}><FaPlus style={{cursor:'pointer'}} onClick={create_user}/></div>
        </div>
    )
}

export default ManageUsersTab;