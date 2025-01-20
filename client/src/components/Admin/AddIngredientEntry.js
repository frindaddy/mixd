import React from "react";
import {FaLemon} from "react-icons/fa";
import "../../format/DrinkList.css";

const AddIngredientEntry = ({setCurrentPage}) => {

    return (
        <div class="list-entry" onClick={()=>{setCurrentPage("manageIngredients")}} style={{cursor: "pointer"}}>
            <div class="glass-container">
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