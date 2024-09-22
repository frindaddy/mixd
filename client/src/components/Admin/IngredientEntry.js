import React, {useEffect, useState} from "react"
import {FaMinus} from "react-icons/fa";

const IngredientEntry = ({index, ingredients, setIngredients, allIngredients}) => {
    const [ingredient, setIngredient] = useState({});

    useEffect(() => {
        if(ingredients[index].unit && ingredients[index].ingredient){
            setIngredient({amount: ingredients[index].amount, unit: ingredients[index].unit, ingredient: ingredients[index].ingredient})
        }
    }, [index, ingredients]);

    function handleFormChange(e) {
        let new_ingredient = {...ingredient, [e.target.name]:e.target.value};
        let temp_ingredients = ingredients;
        temp_ingredients[index] = new_ingredient;
        setIngredient(new_ingredient);
        setIngredients(temp_ingredients);
    }

    return (
        <div>
            <input type='text' placeholder='2' size='10' onChange={handleFormChange} value={ingredient.amount||""} name='amount'/>
            <input type='text' placeholder='oz' size='10' onChange={handleFormChange} value={ingredient.unit||""} name='unit'/>
            <select name='ingredient' onChange={handleFormChange}>
                <option value='' disabled={true} selected={!ingredient.ingredient}>Select Ingredient</option>
                <option value='' disabled={true} selected={ingredient.ingredient && ingredient.ingredient.length !== 36}>Legacy Ingredient</option>
                {allIngredients.map((ingredient)=>{
                    return <option value={ingredient.uuid} selected={ingredient.ingredient===ingredient.uuid}>{ingredient.name}</option>
                })}
            </select>

            {(index === ingredients.length - 1) && <FaMinus style={{marginLeft: "5px"}}
                onClick={() =>{setIngredients(ingredients.slice(0, -1))}}/>}
        </div>
    )
}

export default IngredientEntry;