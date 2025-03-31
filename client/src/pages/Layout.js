import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useState } from "react";
import axios from "axios";
import {FaChevronLeft} from "react-icons/fa";
import Shaker from "../components/DrinkInfo/cocktail_shaker.svg";
import {IoShareOutline} from "react-icons/io5";
import '../format/Navbar.css';

const Layout = ({showLoader, setShowLoader}) => {

    const location = useLocation();
    const navigate = useNavigate();
    const [appInfo, setAppInfo] = useState({});

    function displayNavBar() {
        let route = location.pathname;
        return route !== '/';
    }

    function isDrinkPage(){
        let reserved_routes = ['api', 'static', '404', 'create_drink', 'update_drink', 'account', 'menu'];
        return !reserved_routes.includes(location.pathname.split('/')[1]);
    }

    function isMenuPage() {
        let split_path = location.pathname.split('/');
        return split_path.length > 1 && split_path[1]==='menu' && !location.hash;
    }

    function backArrowClicked() {
        navigate(-1);
        navigate('/');
    }

    function shareButton(){
        if (navigator.share) {
            navigator.share({
                title: document.title,
                url: window.location.href
            }).then();
        }
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
        <>
            {displayNavBar() && <nav>
                <div className="nav-container">
                    <div style={{display:"flex"}}>
                        {!isMenuPage() && <div className="back" style={{cursor: "pointer"}} onClick={()=> backArrowClicked()}><FaChevronLeft/></div>}
                        <Link to='/' className="nav-logo">mixd.</Link>
                    </div>
                    <div>
                        {isDrinkPage() && <IoShareOutline className="share-button" onClick={()=>{shareButton()}} />}
                    </div>
                </div>
            </nav>}
            <div style={{display:"flex", justifyContent:"center"}}>
                <img src={Shaker} className='loading-icon' style={(showLoader && displayNavBar()) ? {}:{display:"none"}}/>
            </div>
            <Outlet />
            {!showLoader && <footer>
                <p>©{appInfo.year} by Jacob Thweatt and Trevor Sides. All Rights Reserved.<br/>
                    Powered by our pure genius.<br/>
                    v{appInfo.version}</p>
            </footer>}
        </>
    )
};

export default Layout;