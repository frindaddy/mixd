import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const AccountPage = ({user, setUser}) => {

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
            <h1>Account</h1>
            <p>{'User: '+user.user_id}</p>
            <p style={{cursor:'pointer'}} onClick={logout}>Logout</p>
        </div>
    )
};

export default AccountPage;