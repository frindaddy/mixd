import {FaCheck} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const LoginPage = ({user, setUser}) => {

    const [userIDField, setUserIDField] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(user !== null){
            navigate('/account', {replace:true});
        }
    }, [user]);

    useEffect(() => {
        document.title = 'Login | mixd.';
    }, []);

    function checkEnter(e) {
        if(e.code === "Enter" || e.code === "NumpadEnter") submitLogin();
    }

    function submitLogin() {
        if(userIDField && typeof userIDField === "number" && userIDField > 10000) {
            axios.get('/api/account/'+userIDField).then(res =>{
                if(res.data && res.data.user_id) {
                    setUser(userIDField);
                }
            }).catch((err) => {
                if(err.response.status === 400){
                    setUserIDField(null);
                } else {
                    console.log(err)
                }
            });
        }
    }

    return (
        <div>
            <div>
                <h1>Login:</h1>
                <input name='user_id' style={{fontSize: '16px'}} inputMode='numeric' content='text' placeholder='00000' value={userIDField||''} onChange={(e)=> setUserIDField(parseInt(e.target.value.substring(0,5)) || null)} onKeyDownCapture={(e)=>{checkEnter(e)}}></input>
                <FaCheck style={{marginLeft: '10px', cursor:'pointer'}} onClick={()=>{submitLogin()}} />
            </div>
        </div>
    )
};

export default LoginPage;