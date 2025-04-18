import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "../../format/LoginPage.css"

const LoginPage = ({user, setUser, setCookie}) => {

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
                    setCookie('user', res.data, {path: '/', expires: new Date(Date.now()+(23.75*3600*1000))});
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
            <input className="login-input" autoFocus name='username' style={{fontSize: '16px'}} enterKeyHint='next' content='text' placeholder='Username or ID' value={accountIdentifier||''} onChange={(e)=> setAccountIdentifier(e.target.value)} onKeyDownCapture={(e)=>{checkEnter(e, focusPin)}}></input>
        </div>
        <div style={{display:"flex", flexWrap:"nowrap", justifyContent:"center", marginTop: '10px'}}>
            <input className="login-input" type="password" ref={pinRef} name='password' style={{fontSize: '16px'}} inputMode='numeric' content='text' placeholder='PIN' value={pin||''} onBlur={(e)=> submitLogin()} onChange={(e)=> setPin(e.target.value.substring(0,6).replace(/[^0-9]/g, '') || null)} onKeyDownCapture={(e)=>{checkEnter(e, submitLogin)}}></input>
        </div>
        <div style={{display:"flex", flexWrap:"nowrap", justifyContent:"center", marginTop: '10px'}}>
            <div className="login-button" onClick={submitLogin}>
                <span>Login</span>
            </div>
        </div>
        </>
    )
};

export default LoginPage;