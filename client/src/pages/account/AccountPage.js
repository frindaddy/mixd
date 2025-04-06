import React, {useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import AccountShortcut from "../../components/AccountShortcut";

const AccountPage = ({user}) => {

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
            <Outlet />
        </div>
    )
};

export default AccountPage;