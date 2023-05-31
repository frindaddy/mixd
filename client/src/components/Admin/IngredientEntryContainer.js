import React, {useEffect, useState} from "react";
import {FaPlus} from "react-icons/fa";
import IngredientEntry from "./IngredientEntry";
const IngredientEntryContainer = ({setInputs}) => {

    const [ingredients, setIngredients] = useState([{}]);

    useEffect(()=> {
        setInputs(values => ({...values, ingredients: ingredients}));
    }, [ingredients, setInputs]);

    return (
        <>
        <p style={{display: "flex", justifyContent: "center", margin: "0px"}}>Ingredients:</p>
        <div style={{display: "flex", justifyContent: "center", marginTop: "5px"}}>
            {ingredients.map((tag, index) => {
                return <IngredientEntry index={index} ingredients={ingredients} setIngredients={setIngredients}/>
            })}
            <FaPlus onClick={() => {setIngredients([...ingredients, {}])}}/>
        </div>
        </>
    )
}

export default IngredientEntryContainer;