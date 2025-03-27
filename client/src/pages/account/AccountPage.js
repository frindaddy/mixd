import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FaSignOutAlt, FaStar} from "react-icons/fa";

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
            <h1>{'Account #'+user.user_id}{user.adminKey && <FaStar style={{color:'gold', marginLeft: '10px', marginBottom:'-3px'}} title='User is an admin'/>}</h1>
        </div>
    )
};

export default AccountPage;