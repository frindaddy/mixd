import React from "react"
import {FaPlus} from "react-icons/fa";
import "../../format/DrinkList.css";

const AddDrinkEntry = ({setCurrentPage}) => {

    return (
        <div class="list-entry" onClick={()=>{setCurrentPage("createDrink")}} style={{cursor: "pointer"}}>
            <div class="glass-container">
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