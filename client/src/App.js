import './format/tags.css';
import './format/mixd.css';
import DrinkList from "./components/DrinkList/DrinkList";
import React, { useState,  useEffect } from "react";
import DrinkInfo from "./components/DrinkInfo/DrinkInfo";
import CreateDrink from "./components/Admin/CreateDrink";
import axios from "axios";


function App() {
    const [appInfo, setAppInfo] = useState({});
    const [currentPage, setCurrentPage] = useState("drinkList");
    const [currentDrink, setCurrentDrink] = useState("");
    const [adminKey, setAdminKey] = useState();

    useEffect(() => {
        window.addEventListener('hashchange', (hash)=>{
            switch(window.location.hash){
                case "#drink":
                    setCurrentPage('drinkInfo');
                    break;
                case "#create":
                    setCurrentPage('createDrink');
                    break;
                case "#update":
                    setCurrentPage('updateDrink');
                    break;
                default:
                    setCurrentPage('drinkList');
                    break;
            }
        });

        axios.get('api/app-info')
            .then((res) => {
                if (res.data) {
                    setAppInfo(res.data);
                }
            }).catch((err) => console.log(err));
    }, []);

    return (
    <div className="App">
        {currentPage === "drinkList" && <DrinkList setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink} adminKey={adminKey} setAdminKey={setAdminKey}/>}
        {currentPage === "drinkInfo" && <DrinkInfo drinkID={currentDrink} setCurrentPage={setCurrentPage}/>}
        {currentPage === "createDrink" && <CreateDrink setCurrentPage={setCurrentPage} drinkID={null} adminKey={adminKey}/>}
        {currentPage === "updateDrink" && <CreateDrink setCurrentPage={setCurrentPage} drinkID={currentDrink} adminKey={adminKey}/>}
        <footer>
            <p>©2023 by Jacob Thweatt and Trevor Sides. All Rights Reserved.<br/>
                Powered by our pure genius. v{appInfo.version}</p>
        </footer>
    </div>
    );
}

export default App;
