import React, {useEffect} from "react";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {FaSignOutAlt, FaStar} from "react-icons/fa";
import "../../format/Account.css";

const AccountPage = ({user, setUser }) => {

    const navigate = useNavigate();

    useEffect(() => {
        if(user.user_id === undefined){
            navigate('/', {replace:true});
        }
    }, [user]);

    useEffect(() => {
        document.title = 'Account | mixd.';
    }, []);
    function logout() {
        setUser({});
        navigate('/', {replace:true})
    }

    return (
        <div>
            <FaSignOutAlt className='user_icon' onClick={logout} />
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