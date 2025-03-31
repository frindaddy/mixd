import React from "react"
import {FaRegUserCircle, FaUserCircle} from "react-icons/fa";
import {useNavigate} from "react-router-dom";

const AccountShortcut = ({user}) => {

    const navigate = useNavigate();

    function userIconClicked() {
        navigate('/account/login');
    }

    return (
        <>
            <div onClick={userIconClicked} style={{cursor:'pointer'}}>
                {user.username && <p style={{position:'absolute', right: '45px', top:'-2px'}}>{user.username}</p>}
                {!user.user_id && <FaRegUserCircle className="user_icon" />}
                {user.user_id && <FaUserCircle className="user_icon" />}
            </div>
        </>

    )
}

export default AccountShortcut;