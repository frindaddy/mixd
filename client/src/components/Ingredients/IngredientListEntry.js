import React, {useEffect, useState} from "react"
import DrinkTags, {filterTags} from "../DrinkTags";
import {FaTrash, FaWrench, FaStar, FaRegStar} from "react-icons/fa";
import axios from "axios";

const IngredientListEntry = ({ingredient, setCurrentPage}) => {

    const setIngredientFilter = () => {
        setCurrentPage("drinkList");
    };

    return (
        <>
            <p className="entry-title" onClick={()=>{setIngredientFilter()}} style={{cursor: "pointer"}}>{ingredient.name}</p>
            <p style={{marginLeft:'10px'}}>({ingredient.count})</p>
        </>
    )
}

export default IngredientListEntry;