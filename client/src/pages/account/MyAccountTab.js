import React, {useState} from "react";
import axios from "axios";
import {FaCheck, FaSignOutAlt, FaStar} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import "../../format/MyAccountTab.css";
import "../../format/Tabs.css";

const MyAccountTab = ({user, setUser, removeCookie}) => {


    const [usernameField, setUsernameField] = useState('');
    const [pinField, setPinField] = useState(null);
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
            axios.post('/api/change_username', {user_id: user.user_id, username: usernameField}, {headers:{Authorization: `Bearer ${user.token}`}}).then(res =>{
                if(res.status === 200){
                    setUser({...user, username: usernameField});
                    setUsernameField('');
                }
            });
        }
    }

    function changePin(){
        axios.post('/api/change_pin', {user_id: user.user_id, pin: pinField}, {headers:{Authorization: `Bearer ${user.token}`}}).then(res =>{
            if(res.status === 200){
                setPinField(null);
                alert('PIN Updated!');
            }
        }).catch(e => {
            alert('Failed to update PIN. PIN unchanged.');
        });
    }

    function logout() {
        setUser({});
        removeCookie('user');
        navigate('/', {replace:true})
    }

    return (
        <>
            <h1 className="tab-title">My Account</h1>
            <div className="account-name">{(user.username ? user.username:'Account')+' #'+user.user_id}{user.isAdmin && <FaStar style={{color:'gold', marginLeft: '10px', marginBottom:'-3px'}} title='User is an admin'/>}</div>
            <p style={{textAlign:"center", fontWeight:"300", marginTop:"10px", marginBottom:"5px"}}>Change Username:</p>
            <div style={{display:"flex", justifyContent:"center", marginLeft:"16px"}}>
                <input className="account-input" name='username' type='text' placeholder={user.username||'Username'} onChange={updateUsernameField} value={usernameField}/>
                <FaCheck style={{cursor:'pointer', marginLeft: '10px', paddingTop:"2px"}} onClick={submitUsername}/>
            </div>
            {usernameField.length > 0 && <p style={{textAlign:"center", fontWeight:"300"}}>{usernameResponse()}</p>}
            <p style={{textAlign:"center", fontWeight:"300", marginBottom:"5px"}}>Change PIN:</p>
            <div style={{display:"flex", justifyContent:"center", marginLeft:"16px"}}>
                <input className="account-input" name='pin' type='numeric' placeholder='New PIN' onChange={(e)=>{setPinField(parseInt(e.target.value.substring(0,6)) || null)}} value={pinField || ''}/>
                <FaCheck style={{cursor:'pointer', marginLeft: '10px', paddingTop:"2px"}} onClick={changePin}/>
            </div>
            <p style={{textAlign:"center", fontWeight:"300", color:"#c0392b"}}>PINs are stored without encryption! Do not use a sensitive PIN!</p>
            <div style={{display:"flex", justifyContent:"center"}}>
                <div style={{cursor:'pointer', padding:'8px', backgroundColor:'darkred', borderRadius:'5px'}} onClick={logout}>
                    <span>Logout</span>
                    <FaSignOutAlt style={{marginLeft:'10px', marginBottom: '-2px'}}/>
                </div>
            </div>
        </>
    )
};

export default MyAccountTab;