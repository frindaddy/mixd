import React, {useEffect, useState} from "react"
import DrinkTags, {filterTags} from "../DrinkTags";
import {FaTrash, FaWrench, FaStar, FaRegStar} from "react-icons/fa";
import axios from "axios";

const IngredientListEntry = ({ingredient, setCurrentPage, setIngrFilter}) => {

    const setIngredientFilter = () => {
        setCurrentPage("drinkList");
        setIngrFilter([ingredient.uuid, ingredient.name])
    };

    return (
        <>
            <p className="entry-title" onClick={()=>{setIngredientFilter()}} style={{cursor: "pointer"}}>{ingredient.name}</p>
            <p style={{marginLeft:'10px'}}>({ingredient.count})</p>
        </>
    )
}

export default IngredientListEntry;