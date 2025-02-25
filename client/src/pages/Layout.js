import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState } from "react";
import axios from "axios";
import {FaChevronLeft} from "react-icons/fa";
import Shaker from "../components/DrinkInfo/cocktail_shaker.svg";

const Layout = ({showLoader, setShowLoader}) => {

    const location = useLocation();
    const navigate = useNavigate();
    const [appInfo, setAppInfo] = useState({});

    function displayNavBar() {
        let route = location.pathname;
        return route !== '/';
    }

    function backArrowClicked() {
        navigate(-1);
        navigate('/');
    }

    useEffect(() => {
        axios.get('/api/app-info')
            .then((res) => {
                if (res.data) {
                    res.data.year = new Date().getFullYear();
                    setAppInfo(res.data);
                }
            }).catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        setShowLoader(false);
        document.title = 'mixd.';
    }, [location.pathname]);

    return (
        <div className="App">
            {displayNavBar() && <nav>
                <div className="nav-container">
                    <div className="back" style={{cursor: "pointer"}} onClick={()=> backArrowClicked()}><FaChevronLeft/></div>
                    <Link to='/' className="nav-logo">mixd.</Link>
                </div>
            </nav>}
            <div style={{display:"flex", justifyContent:"center"}}>
                <img src={Shaker} className='loading-icon' style={showLoader ? {}:{display:"none"}}/>
            </div>
            <Outlet />
            {!showLoader && <footer>
                <p>©{appInfo.year} by Jacob Thweatt and Trevor Sides. All Rights Reserved.<br/>
                    Powered by our pure genius.<br/>
                    v{appInfo.version}</p>
            </footer>}
        </div>
    )
};

export default Layout;