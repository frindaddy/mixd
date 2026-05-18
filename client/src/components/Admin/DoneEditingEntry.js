import React from "react"
import {FaCheck} from "react-icons/fa";
import "../../format/DrinkEntry.css";

const DoneEditingEntry = ({}) => {

    return (
        <div className="drink-entry" style={{cursor: "pointer"}}>
            <div className="glass-container">
                <FaCheck style={{margin:'30px', fontSize:'30px'}}/>
            </div>
            <div className="drink-entry-info">
                <p className="drink-entry-title">Done Editing</p>
            </div>
        </div>
    )
}

export default DoneEditingEntry;