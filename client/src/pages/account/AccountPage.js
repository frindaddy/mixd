import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaSignOutAlt, FaStar} from "react-icons/fa";
import "../../format/Account.css";
import MyBarTab from "./MyBarTab";
import SettingsTab from "./SettingsTab";
import AdminTab from "./AdminTab";
import MenusTab from "./MenusTab";

const AccountPage = ({user, setUser}) => {

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
            <h1>{(user.username ? user.username:'Account')+' #'+user.user_id}{user.adminKey && <FaStar style={{color:'gold', marginLeft: '10px', marginBottom:'-3px'}} title='User is an admin'/>}</h1>
            <div className='account-nav'>
                <span onClick={()=>setCurrentTab('myBar')}>My Bar</span>
                <span onClick={()=>setCurrentTab('menus')}>Menus</span>
                <span onClick={()=>setCurrentTab('settings')}>Account Settings</span>
                {user.adminKey && <span onClick={()=>setCurrentTab('admin')}>Admin Controls</span>}
            </div>
            <div>
                {currentTab === 'myBar' && <MyBarTab />}
                {currentTab === 'menus' && <MenusTab />}
                {currentTab === 'settings' && <SettingsTab user={user} setUser={setUser}/>}
                {currentTab === 'admin' && <AdminTab />}
            </div>
        </div>
    )
};

export default AccountPage;