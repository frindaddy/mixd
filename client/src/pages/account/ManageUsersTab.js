import React, {useEffect, useState} from "react"
import {FaPlus, FaTrash} from "react-icons/fa";
import axios from "axios";
import '../../format/ManageIngredients.css';

const AdminTab = ({adminKey}) => {
    const [errorMsg, setErrorMsg] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('/api/users').then(res => {
            if(res.data){
                setUsers(res.data);
            }
        }).catch((err) => console.log(err));
    }, []);

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

    function confirmDeleteUser(user) {
        if(window.confirm('Are you sure you want to delete user '+user.user_id + (user.username ? (' ('+user.username+')'):'')+'?') === true){
            axios.delete('/api/user/'+user.user_id, {headers:{Authorization: `Bearer ${adminKey}`}})
                .then(() => {
                    setUsers(users.filter(user_entry => user_entry.user_id !== user.user_id));
                }).catch((err) => {
                setErrorMsg('Failed to delete user. Internal server error '+err.response.status);
            });
        } else {
            alert('User not deleted.');
        }
    }

    return (
        <div>
            <h1 className="manage-ingredients-title" style={{marginTop:"20px", marginBottom:"-10px"}}>Manage Users</h1>
            {users.map((user) =>{
                return <div>
                    <div style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
                        <span className="manage-ingredients-entry">{user.user_id + (user.username ? (' ('+user.username+')'):'')}</span>
                        {typeof user.user_id === "number" && <FaTrash style={{marginLeft:'10px', cursor:'pointer'}} onClick={()=>{confirmDeleteUser(user)}}/>}
                    </div>
                </div>
            })}
            <div style={{display: "flex", justifyContent: "center", alignItems:"center", marginTop:"10px"}}><FaPlus style={{cursor:'pointer'}} onClick={create_user}/></div>
        </div>
    )
}

export default AdminTab;