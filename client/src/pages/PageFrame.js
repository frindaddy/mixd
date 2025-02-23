import { Outlet } from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";

const PageFrame = () => {

    const [appInfo, setAppInfo] = useState({});

    useEffect(() => {
        axios.get('api/app-info')
            .then((res) => {
                if (res.data) {
                    res.data.year = new Date().getFullYear();
                    setAppInfo(res.data);
                }
            }).catch((err) => console.log(err));
    }, []);

    return (
        <div className="App">
            <Outlet />
            <footer>
                <p>©{appInfo.year} by Jacob Thweatt and Trevor Sides. All Rights Reserved.<br/>
                    Powered by our pure genius.<br/>
                    v{appInfo.version}</p>
            </footer>
        </div>
    )
};

export default PageFrame;