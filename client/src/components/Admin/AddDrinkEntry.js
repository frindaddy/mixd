import React from "react"
import {FaPlus} from "react-icons/fa";
const AddDrinkEntry = ({setCurrentPage}) => {

    return (
        <div class="drink-entry" onClick={()=>{setCurrentPage("createDrink")}} style={{cursor: "pointer"}}>
            <div class="glass-container">
                <FaPlus style={{margin: '30px', fontSize:'30px'}}/>
            </div>
            <div className="entry-column">
                <div>
                    <p className="entry-title">Add New Drink</p>
                </div>
            </div>
        </div>
    )
}

export default AddDrinkEntry;