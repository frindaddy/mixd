import React from "react"
import {FaEye} from "react-icons/fa";
import "../../format/DrinkEntry.css";

const AddDrinkEntry = ({}) => {

    return (
        <div className="drink-entry" style={{cursor: "pointer"}}>
            <div className="glass-container">
                <FaEye style={{margin: '20px', fontSize:'40px'}}/>
            </div>
            <div className="drink-entry-info">
                <p className="drink-entry-title">View Public Menu</p>
            </div>
        </div>
    )
}

export default AddDrinkEntry;