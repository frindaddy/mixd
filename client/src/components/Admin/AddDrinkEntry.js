import React from "react"
import {FaPlus} from "react-icons/fa";
import "../../format/DrinkEntry.css";

const AddDrinkEntry = ({}) => {

    return (
        <div className="drink-entry" style={{cursor: "pointer"}}>
            <div className="glass-container">
                <FaPlus style={{margin: '30px', fontSize:'30px'}}/>
            </div>
            <div className="drink-entry-info">
                <p className="drink-entry-title">Add New Drink</p>
            </div>
        </div>
    )
}

export default AddDrinkEntry;