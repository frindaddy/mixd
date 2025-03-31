import React, {useEffect} from "react";
import {Link, Outlet, useNavigate} from "react-router-dom";
import "../../format/Account.css";

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
            <div className='account-nav'>
                <Link to='/account'>My Account</Link>
                <div className="account-nav-break"></div>
                <Link to='/account/bar'>My Bar</Link>
                <div className="account-nav-break"></div>
                <Link to='/account/menus'>Menus</Link>
                {user.adminKey && <div className="account-nav-break"></div>}
                {user.adminKey && <Link to='/account/admin'>Admin Controls</Link>}
            </div>
            <Outlet />
        </div>
    )
};

export default AccountPage;