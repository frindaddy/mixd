import {FaCheck, FaSignOutAlt} from "react-icons/fa";
import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const LoginPage = ({user, setUser}) => {

    const [invalidLogin, setInvalidLogin] = useState(false);
    const [accountIdentifier, setAccountIdentifier] = useState('');
    const [pin, setPin] = useState(null);
    const navigate = useNavigate();
    const pinRef = useRef(null);

    useEffect(() => {
        if(user.user_id){
            navigate('/', {replace:true});
        }
    }, [user]);

    useEffect(() => {
        document.title = 'Login | mixd.';
    }, []);

    function checkEnter(e, funcCall) {
        if(e.code === "Enter" || e.code === "NumpadEnter") funcCall();
    }

    function focusPin() {
        pinRef.current.focus();
    }

    function submitLogin() {
        if(accountIdentifier !== '') {
            axios.post('/api/login', {accountIdentifier: accountIdentifier, pin: pin}).then(res =>{
                if(res.data && res.data.user_id) {
                    setUser(res.data);
                }
            }).catch((err) => {
                if(err.response.status === 403){
                    setInvalidLogin(true);
                    setPin(null);
                } else {
                    console.log(err)
                }
            });
        }
    }

    return (
        <>
        <h1 style={{textAlign:"center"}}>Bartender Login:</h1>
        {invalidLogin && <p style={{color: 'red', textAlign:"center"}}>User and PIN combination not recognized.</p>}
        <div style={{display:"flex", flexWrap:"nowrap", justifyContent:"center"}}>
            <input autoFocus name='username' style={{fontSize: '16px'}} enterKeyHint='next' content='text' placeholder='Username or ID' value={accountIdentifier||''} onChange={(e)=> setAccountIdentifier(e.target.value)} onKeyDownCapture={(e)=>{checkEnter(e, focusPin)}}></input>
        </div>
        <div style={{display:"flex", flexWrap:"nowrap", justifyContent:"center", marginTop: '10px'}}>
            <input ref={pinRef} name='pin' style={{fontSize: '16px'}} inputMode='numeric' content='text' placeholder='PIN' value={pin||''} onBlur={(e)=> submitLogin()} onChange={(e)=> setPin(parseInt(e.target.value.substring(0,6)) || null)} onKeyDownCapture={(e)=>{checkEnter(e, submitLogin)}}></input>
        </div>
        <div style={{display:"flex", flexWrap:"nowrap", justifyContent:"center", marginTop: '10px'}}>
            <div style={{cursor:'pointer', padding:'8px', backgroundColor:'darkred', borderRadius:'5px'}} onClick={submitLogin}>
                <span>Login</span>
            </div>
        </div>
        </>
    )
};

export default LoginPage;