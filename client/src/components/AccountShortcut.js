import React, {useState} from "react"
import {FaRegUserCircle, FaSignOutAlt, FaUserCircle} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

const AccountShortcut = ({user, setUser}) => {

    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();

    function userIconClicked() {
        if(user.user_id){
            setShowDropdown(!showDropdown);
        } else {
            navigate('/account/login');
        }
    }

    function goTo(route) {
        setShowDropdown(false);
        navigate(route);
    }

    function logout() {
        setUser({});
        navigate('/', {replace:true})
        setShowDropdown(false);
    }

    return (
        <div className='account-shortcut'>
            <div onClick={userIconClicked} style={{cursor:'pointer'}}>
                {user.username && <span className='shortcut-username'>{user.username}</span>}
                {!user.user_id && <FaRegUserCircle className="user_icon" />}
                {user.user_id && <FaUserCircle className="user_icon" />}
            </div>
            {showDropdown && <div className='account-dropdown'>
                <span onClick={()=>{goTo('/account')}}>My Account</span>
                <hr />
                <span onClick={()=>{goTo('/account/bar')}}>My Bar</span>
                <hr />
                <span onClick={()=>{goTo('/account/menus')}}>My Menus</span>
                {user.adminKey && <hr />}
                {user.adminKey && <span onClick={()=>{goTo('/account/admin')}}>Admin Controls</span>}
                <hr />
                <div onClick={logout}>
                    <span>Logout</span>
                    <FaSignOutAlt style={{marginLeft:'10px', marginBottom: '-2px'}}/>
                </div>

            </div>}
        </div>
    )
}

export default AccountShortcut;