import {useState} from "react";
import axios from "axios";

const SettingsTab = ({}) => {


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
                setUsernameStatus({taken: false, valid: false});
            }
        } else {
            setUsernameField('');
            setUsernameStatus({taken: false, valid: false});
        }
    }

    return (
        <div>
            <p>Change Username:</p>
            {usernameField.length > 0 && <p>{usernameResponse()}</p>}
            <input name='username' type='text' placeholder='Username' onChange={updateUsernameField} value={usernameField}/>
        </div>
    )
};

export default SettingsTab;