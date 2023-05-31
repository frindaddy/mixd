import React, {useEffect, useState} from "react";
import {FaPlus} from "react-icons/fa";
import IngredientEntry from "./IngredientEntry";
const IngredientEntryContainer = ({setInputs}) => {

    const [ingredients, setIngredients] = useState([{}]);

    useEffect(()=> {
        setInputs(values => ({...values, ingredients: ingredients}));
    }, [ingredients, setInputs]);

    return (
        <div>
            {ingredients.map((tag, index) => {
                return <IngredientEntry index={index} ingredients={ingredients} setIngredients={setIngredients}/>
            })}
            <FaPlus onClick={() => {setIngredients([...ingredients, {}])}}/>
        </div>
    )
}

export default IngredientEntryContainer;