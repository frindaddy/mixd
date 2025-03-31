import React, {useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import "../../format/Account.css";
import AccountShortcut from "../../components/AccountShortcut";

const AccountPage = ({user, setUser}) => {

    const navigate = useNavigate();

    useEffect(() => {
        if(user.user_id === undefined){
            navigate('/', {replace:true});
        }
    }, [user]);

    useEffect(() => {
        document.title = 'Account | mixd.';
    }, []);


    return (
        <div>
            <AccountShortcut user={user} setUser={setUser}/>
            <Outlet />
        </div>
    )
};

export default AccountPage;