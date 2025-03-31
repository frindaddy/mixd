import React, {useState} from "react"
import {FaRegUserCircle, FaUserCircle} from "react-icons/fa";
import {Link, useNavigate} from "react-router-dom";

const AccountShortcut = ({user}) => {

    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();

    function userIconClicked() {
        if(user.user_id){
            setShowDropdown(!showDropdown);
        } else {
            navigate('/account/login');
        }
    }

    return (
        <div className='account-shortcut'>
            <div onClick={userIconClicked} style={{cursor:'pointer'}}>
                {user.username && <span style={{position:'absolute', right: '40px', top:'4px'}}>{user.username}</span>}
                {!user.user_id && <FaRegUserCircle className="user_icon" />}
                {user.user_id && <FaUserCircle className="user_icon" />}

            </div>
            <div className='dropdown-triangle' />
            {showDropdown && <div className='account-dropdown'>
                <Link to='/account'>My Account</Link>
                <hr />
                <Link to='/account/bar'>My Bar</Link>
                <hr />
                <Link to='/account/menu'>My Menus</Link>
            </div>}
        </div>
    )
}

export default AccountShortcut;