import React from "react"
import {FaCheck} from "react-icons/fa";
import "../../format/DrinkList.css";

const DoneEntry = ({}) => {

    return (
        <div className="list-entry" style={{cursor: "pointer"}}>
            <div className="glass-container">
                <FaCheck style={{margin: '30px', fontSize:'30px'}}/>
            </div>
            <div className="list-column">
                <div>
                    <p className="list-title">Done</p>
                </div>
            </div>
        </div>
    )
}

export default DoneEntry;