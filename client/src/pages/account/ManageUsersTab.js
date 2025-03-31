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
        setUsers([...users, 'Creating user...']);
        axios.post('/api/create_user', {}, {
                headers: {
                    Authorization: `Bearer ${adminKey}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            if(res.data && res.data.user_id){
                let new_users = [...users]
                new_users[new_users.length - 1] = res.data.user_id
                setUsers(new_users);
            }
        }).catch((err) => {
            let new_users = [...users]
            new_users.pop();
            setUsers(new_users);
            setErrorMsg('Failed to create user. Internal server error '+err.response.status);
        });
    }

    function confirmDeleteUser(userID) {
        if(window.confirm('Are you sure you want to delete user \''+userID+'\'?') === true){
            axios.delete('/api/user/'+userID, {headers:{Authorization: `Bearer ${adminKey}`}})
                .then(() => {
                    setUsers(users.filter(user => user !== userID));
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
                        <span className="manage-ingredients-entry">{user}</span>
                        {typeof user === "number" && <FaTrash style={{marginLeft:'10px', cursor:'pointer'}} onClick={()=>{confirmDeleteUser(user)}}/>}
                    </div>
                </div>
            })}
            <div style={{display: "flex", justifyContent: "center", alignItems:"center", marginTop:"10px"}}><FaPlus style={{cursor:'pointer'}} onClick={create_user}/></div>
        </div>
    )
}

export default AdminTab;