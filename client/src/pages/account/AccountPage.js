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
            <div className="account-name">{(user.username ? user.username:'Account')+' #'+user.user_id}{user.adminKey && <FaStar style={{color:'gold', marginLeft: '10px', marginBottom:'-3px'}} title='User is an admin'/>}</div>
            <div className='account-nav'>
                <Link to='/account/bar'>My Bar</Link>
                <div className="account-nav-break"></div>
                <Link to='/account/menus'>Menus</Link>
                <div className="account-nav-break"></div>
                <Link to='/account/settings'>Account Settings</Link>
                {user.adminKey && <div className="account-nav-break"></div>}
                {user.adminKey && <Link to='/account/admin'>Admin Controls</Link>}
            </div>
            <Outlet />
        </div>
    )
};

export default AccountPage;