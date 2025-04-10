import React, {useEffect, useState} from "react"
import {FaKey, FaPlus, FaRegStar, FaStar, FaTrash} from "react-icons/fa";
import axios from "axios";
import '../../format/Tabs.css';

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
            setErrorMsg('Failed to create user. Internal server error '+err.response.status+'.');
        });
    }

    function confirmDeleteUser(userToDelete) {
        if(window.confirm('Are you sure you want to delete user '+userToDelete.user_id + (userToDelete.username ? (' ('+userToDelete.username+')'):'')+'?') === true){
            axios.delete('/api/user/'+userToDelete.user_id, {headers:{Authorization: `Bearer ${adminKey}`}})
                .then(() => {
                    setUsers(users.filter(user_entry => user_entry.user_id !== userToDelete.user_id));
                }).catch((err) => {
                setErrorMsg('Failed to delete user. Internal server error '+err.response.status+'.');
            });
        } else {
            alert('User not deleted.');
        }
    }

    function confirmResetPin(userToDelete) {
        if(window.confirm('Are you sure you want to reset the PIN for user '+userToDelete.user_id + (userToDelete.username ? (' ('+userToDelete.username+')'):'')+'?') === true){
            axios.delete('/api/pin/'+userToDelete.user_id, {headers:{Authorization: `Bearer ${adminKey}`}})
                .then(() => {
                    alert(userToDelete.user_id + (userToDelete.username ? (' ('+userToDelete.username+')'):'')+' PIN reset.');
                }).catch((err) => {
                setErrorMsg('Failed to update PIN. Internal server error '+err.response.status);
            });
        } else {
            alert('User PIN unchanged.');
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
                setErrorMsg('Failed to edit user. Internal server error '+err.response.status+'.');
            });
        } else {
            setErrorMsg('You cannot demote yourself.')
        }
    }

    return (
        <>
            <h1 className="tab-title">Manage Users</h1>
            {errorMsg && <p style={{textAlign:"center", fontWeight:"300"}}>{errorMsg}</p>}
            {users.map((userEntry) =>{
                return <div style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
                    <span className="manage-ingredients-entry">{userEntry.user_id + (userEntry.username ? (' ('+userEntry.username+')'):'')}</span>
                    {userEntry.admin && <FaStar style={{cursor:'pointer', marginLeft:'8px'}} onClick={()=>{changeAdmin(userEntry, false)}}/>}
                    {!userEntry.admin && <FaRegStar style={{cursor:'pointer', marginLeft:'8px'}} onClick={()=>{changeAdmin(userEntry, true)}}/>}
                    <FaTrash style={{marginLeft:'10px', cursor:'pointer'}} onClick={()=>{confirmDeleteUser(userEntry)}}/>
					<FaKey style={{marginLeft:'10px', cursor:'pointer'}} onClick={()=>{confirmResetPin(userEntry)}}/>
                </div>
            })}
            <div style={{display: "flex", justifyContent: "center", alignItems:"center", marginTop:"10px"}}><FaPlus style={{cursor:'pointer'}} onClick={create_user}/></div>
        </>
    )
}

export default ManageUsersTab;