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
        setUsernameField(e.target.value);
        if(e.target.value && e.target.value.length > 0){
            axios.get('/api/check_username/'+e.target.value).then(res => {
                if(res.data){
                    setUsernameStatus(res.data);
                }
            });
        } else {
            setUsernameStatus({taken: false, valid: false});
        }
    }

    return (
        <div>
            <p>Change Username:</p>
            <input name='username' type='text' placeholder='Username' onChange={updateUsernameField} value={usernameField}/>
            {usernameField.length > 0 && <p>{usernameResponse()}</p>}
        </div>
    )
};

export default SettingsTab;