import React, {useEffect, useState} from "react";
import {FaPlus} from "react-icons/fa";
import IngredientEntry from "./IngredientEntry";
const IngredientEntryContainer = ({inputs, setInputs, allIngredients}) => {

    const [ingredients, setIngredients] = useState([{}]);

    useEffect(() => {
        if(inputs.ingredients){
            setIngredients(inputs.ingredients);
        }
    }, [inputs]);

    const updateAllIngredients = (new_ingr) => {
        setIngredients(new_ingr);
        setInputs(values => ({...values, ingredients: new_ingr}));
    }

    return (
        <div>
            {ingredients.map((ingredient, index) => {
                return <IngredientEntry index={index} ingredients={ingredients} setIngredients={updateAllIngredients} allIngredients={allIngredients}/>
            })}
            <div style={{display: "flex", justifyContent: "center", marginTop: "5px"}}>
                <FaPlus onClick={() => {setIngredients([...ingredients, {}])}}/>
            </div>
        </div>
    )
}

export default IngredientEntryContainer;