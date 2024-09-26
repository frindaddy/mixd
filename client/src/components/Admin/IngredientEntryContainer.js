import React, {useEffect, useState} from "react";
import {FaPlus} from "react-icons/fa";
import IngredientEntry from "./IngredientEntry";
const IngredientEntryContainer = ({inputs, setInputs, allIngredients}) => {

    const [ingredients, setIngredients] = useState([{}, {}, {}, {}, {}]);

    useEffect(() => {
        if(inputs.ingredients){
            setIngredients(inputs.ingredients);
        }
    }, [inputs]);

    const updateAllIngredients = (new_ingr) => {
        setIngredients(new_ingr);
        setInputs(values => ({...values, ingredients: new_ingr}));
    }

    function swapIngredients(index1, index2) {
        let ingr1 = ingredients[index1]
        ingredients[index1] = ingredients[index2]
        ingredients[index2] = ingr1
        updateAllIngredients([...ingredients])
    }

    return (
        <div>
            {ingredients.map((ingredient, index) => {
                return <IngredientEntry index={index} ingredients={ingredients} setIngredients={updateAllIngredients} allIngredients={allIngredients} swapIngredients={swapIngredients} />
            })}
            <div style={{display: "flex", justifyContent: "center", marginTop: "5px"}}>
                <FaPlus onClick={() => {setIngredients([...ingredients, {}])}}/>
            </div>
        </div>
    )
}

export default IngredientEntryContainer;