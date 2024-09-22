import React from "react"
import {FaLemon} from "react-icons/fa";
const AddIngredientEntry = ({setCurrentPage}) => {

    return (
        <div class="drink-entry" onClick={()=>{setCurrentPage("manageIngredients")}} style={{cursor: "pointer"}}>
            <div class="glass-container">
                <FaLemon style={{margin: '30px', fontSize:'30px'}}/>
            </div>
            <div className="entry-column">
                <div>
                    <p className="entry-title">Manage Ingredients</p>
                </div>
            </div>
        </div>
    )
}

export default AddIngredientEntry;