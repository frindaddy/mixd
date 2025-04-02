import React, {useState} from "react";
import axios from "axios";
import {FaCheck, FaSignOutAlt, FaStar} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import "../../format/MyAccountTab.css";
import "../../format/Tabs.css";

const MyAccountTab = ({user, setUser}) => {


    const [usernameField, setUsernameField] = useState('')
    const [usernameStatus, setUsernameStatus] = useState({taken: false, valid: false});

    const navigate = useNavigate();

    function usernameResponse(){
        if(!usernameStatus.valid) return "Invalid username.";
        if(usernameStatus.taken) return "Username taken.";
        return "Username is available!";
    }
    function updateUsernameField(e){
        if(e.target.value){
            let sanitized_name = e.target.value.replace(/[^a-z0-9_.]/i, '');
            setUsernameField(sanitized_name);
            if(sanitized_name.length > 0){
                axios.get('/api/check_username/'+sanitized_name).then(res => {
                    if(res.data){
                        setUsernameStatus(res.data);
                    }
                });
            } else {
                setUsernameField('');
                setUsernameStatus({taken: false, valid: false});
            }
        } else {
            setUsernameField('');
            setUsernameStatus({taken: false, valid: false});
        }
    }

    function submitUsername(){
        if(!usernameStatus.taken && usernameStatus.valid){
            axios.post('/api/change_username', {user_id: user.user_id, username: usernameField}).then(res =>{
                if(res.status === 200){
                    setUser({...user, username: usernameField});
                    setUsernameField('');
                }
            });
        }
    }

    function logout() {
        setUser({});
        navigate('/', {replace:true})
    }

    return (
        <>
            <h1 className="tab-title">My Account</h1>
            <div className="account-name">{(user.username ? user.username:'Account')+' #'+user.user_id}{user.adminKey && <FaStar style={{color:'gold', marginLeft: '10px', marginBottom:'-3px'}} title='User is an admin'/>}</div>
            <p style={{textAlign:"center", fontWeight:"300"}}>Change Username:</p>
            <div style={{display:"flex", justifyContent:"center", marginLeft:"16px"}}>
                <input name='username' type='text' placeholder={user.username||'Username'} onChange={updateUsernameField} value={usernameField}/>
                <FaCheck style={{cursor:'pointer', marginLeft: '10px', paddingTop:"2px"}} onClick={submitUsername}/>
            </div>
            {usernameField.length > 0 && <p style={{textAlign:"center", fontWeight:"300"}}>{usernameResponse()}</p>}
            <div style={{display:"flex", justifyContent:"center", marginTop: '20px'}}>
                <div style={{cursor:'pointer', padding:'8px', backgroundColor:'darkred', borderRadius:'5px'}} onClick={logout}>
                    <span>Logout</span>
                    <FaSignOutAlt style={{marginLeft:'10px', marginBottom: '-2px'}}/>
                </div>
            </div>
        </>
    )
};

export default MyAccountTab;