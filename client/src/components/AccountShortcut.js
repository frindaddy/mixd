import React, {useState} from "react"
import {FaRegUserCircle, FaSignOutAlt, FaUserCircle} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import "../format/AccountShortcut.css"

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
            <div onClick={userIconClicked} className="shortcut-nav-container">
                {user.username && <div className='shortcut-username'>{user.username}</div>}
                {!user.user_id && <FaRegUserCircle className="user_icon" />}
                {user.user_id && <FaUserCircle className="user_icon" />}
            </div>
            {showDropdown && <div className='account-dropdown'>
                <span onClick={()=>{goTo('/account')}}>My Account</span>
                <hr />
                <span onClick={()=>{goTo('/account/bar')}}>My Bar</span>
                <hr />
                <span onClick={()=>{goTo('/account/menus')}}>My Menus</span>
                <hr />
                <span onClick={()=>{goTo('/account/statistics')}}>Statistics</span>
                {user.adminKey && <>
                    <hr />
                    <span onClick={()=>{goTo('/account/edit_drinks')}}>Manage Drinks</span>
                    <hr />
                    <span onClick={()=>{goTo('/account/edit_ingredients')}}>Manage Ingredients</span>
                    <hr />
                    <span onClick={()=>{goTo('/account/users')}}>Manage Users</span>
                </>}

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