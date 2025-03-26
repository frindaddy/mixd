import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const AccountPage = ({user, setUser}) => {

    const navigate = useNavigate();

    useEffect(() => {
        if(user === null){
            navigate('/', {replace:true});
        }
    }, [user]);

    useEffect(() => {
        document.title = 'Account | mixd.';
    }, []);
    function logout() {
        setUser(null);
        navigate('/', {replace:true})
    }

    return (
        <div>
            <h1>Account</h1>
            <p>{'User: '+user}</p>
            <p style={{cursor:'pointer'}} onClick={logout}>Logout</p>
        </div>
    )
};

export default AccountPage;