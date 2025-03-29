import {useState} from "react";
import axios from "axios";
import {FaCheck} from "react-icons/fa";

const SettingsTab = ({user, setUser}) => {


    const [usernameField, setUsernameField] = useState('')
    const [usernameStatus, setUsernameStatus] = useState({taken: false, valid: false});

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

    return (
        <>
            <p style={{textAlign:"center"}}>Change Username:</p>
            {usernameField.length > 0 && <p>{usernameResponse()}</p>}
            <div style={{display:"flex", justifyContent:"center", marginLeft:"16px"}}>
                <input name='username' type='text' placeholder={user.username||'Username'} onChange={updateUsernameField} value={usernameField}/>
                <FaCheck style={{cursor:'pointer', marginLeft: '10px', paddingTop:"2px"}} onClick={submitUsername}/>
            </div>
        </>
    )
};

export default SettingsTab;