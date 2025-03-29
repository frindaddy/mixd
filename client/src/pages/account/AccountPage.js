import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaSignOutAlt, FaStar} from "react-icons/fa";
import "../../format/Account.css";
import SettingsTab from "./SettingsTab";
import MenusTab from "./MenusTab";
import MyBarTab from "./MyBarTab";
import AdminTab from "./AdminTab";

const AccountPage = ({user, setUser, setIngrFilter, setUserDrinksReq }) => {

    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState('myBar');

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
                <span onClick={()=>setCurrentTab('myBar')}>My Bar</span>
                <div className="account-nav-break"></div>
                <span onClick={()=>setCurrentTab('menus')}>Menus</span>
                <div className="account-nav-break"></div>
                <span onClick={()=>setCurrentTab('settings')}>Account Settings</span>
                {user.adminKey && <div className="account-nav-break"></div>}
                {user.adminKey && <span onClick={()=>setCurrentTab('admin')}>Admin Controls</span>}
            </div>
            <>
                {currentTab === 'myBar' && <MyBarTab setIngrFilter={setIngrFilter} setUserDrinksReq={setUserDrinksReq} user={user} setUser={setUser} />}
                {currentTab === 'menus' && <MenusTab user={user}/>}
                {currentTab === 'settings' && <SettingsTab user={user} setUser={setUser}/>}
                {currentTab === 'admin' && <AdminTab adminKey={user.adminKey} />}
            </>
        </div>
    )
};

export default AccountPage;