import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState } from "react";
import axios from "axios";
import {FaChevronLeft} from "react-icons/fa";

const Layout = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [appInfo, setAppInfo] = useState({});

    function displayNavBar() {
        let route = location.pathname;
        return route !== '/';
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

    return (
        <div className="App">
            {displayNavBar() && <nav>
                <div className="nav-container">
                    <div className="back" style={{cursor: "pointer"}} onClick={()=> navigate(-1)}><FaChevronLeft/></div>
                    <Link to='/' className="nav-logo">mixd.</Link>
                </div>
            </nav>}
            <Outlet />
            <footer>
                <p>©{appInfo.year} by Jacob Thweatt and Trevor Sides. All Rights Reserved.<br/>
                    Powered by our pure genius.<br/>
                    v{appInfo.version}</p>
            </footer>
        </div>
    )
};

export default Layout;