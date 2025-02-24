import React from "react";
import {FaLemon} from "react-icons/fa";
import "../../format/DrinkList.css";

const AddIngredientEntry = () => {

    return (
        <div className="list-entry" style={{cursor: "pointer"}}>
            <div className="glass-container">
                <FaLemon style={{margin: '30px', fontSize:'30px'}}/>
            </div>
            <div className="list-column">
                <div>
                    <p className="list-title">Manage Ingredients</p>
                </div>
            </div>
        </div>
    )
}

export default AddIngredientEntry;