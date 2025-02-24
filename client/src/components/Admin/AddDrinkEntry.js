import React from "react"
import {FaPlus} from "react-icons/fa";
import "../../format/DrinkList.css";
import {Link} from "react-router-dom";

const AddDrinkEntry = ({}) => {

    return (
        <div className="list-entry" style={{cursor: "pointer"}}>
            <div className="glass-container">
                <FaPlus style={{margin: '30px', fontSize:'30px'}}/>
            </div>
            <div className="list-column">
                <div>
                    <p className="list-title">Add New Drink</p>
                </div>
            </div>
        </div>
    )
}

export default AddDrinkEntry;