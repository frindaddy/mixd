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
            <h1>{'Account #'+user.user_id}</h1>
            {user.adminKey && <p>User is an admin</p>}
            <p style={{cursor:'pointer'}} onClick={logout}>Logout</p>
        </div>
    )
};

export default AccountPage;