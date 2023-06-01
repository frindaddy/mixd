import React, {useEffect, useState} from "react";
import {FaPlus} from "react-icons/fa";
import IngredientEntry from "./IngredientEntry";
const IngredientEntryContainer = ({setInputs}) => {

    const [ingredients, setIngredients] = useState([{}]);

    const updateAllIngredients = (new_ingr) => {
        setIngredients(new_ingr);
        setInputs(values => ({...values, ingredients: new_ingr}));
    }

    return (
        <div>
            {ingredients.map((tag, index) => {
                return <IngredientEntry index={index} ingredients={ingredients} setIngredients={updateAllIngredients}/>
            })}
            <FaPlus onClick={() => {setIngredients([...ingredients, {}])}}/>
        </div>
    )
}

export default IngredientEntryContainer;