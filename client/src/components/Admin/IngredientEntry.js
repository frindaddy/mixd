import React, {useEffect, useState} from "react"
import {FaMinus} from "react-icons/fa";

const IngredientEntry = ({index, ingredients, setIngredients, allIngredients}) => {
    const [ingredient, setIngredient] = useState({});
    const units = ['oz']

    useEffect(() => {
        if(ingredients[index].unit && ingredients[index].ingredient){
            let dropdown = ingredients[index].unit
            if(!units.includes(dropdown) && dropdown !== undefined) dropdown = 'custom'
            setIngredient({amount: ingredients[index].amount, unit: ingredients[index].unit, ingredient: ingredients[index].ingredient, unit_dropdown: dropdown})
        }
    }, [index, ingredients]);

    function handleFormChange(e) {
        let new_ingredient = {...ingredient, [e.target.name]:e.target.value};
        if(new_ingredient['unit_dropdown'] !== "custom"){
            new_ingredient['unit'] = new_ingredient['unit_dropdown']
        }
        let temp_ingredients = ingredients;
        temp_ingredients[index] = new_ingredient;
        setIngredient(new_ingredient);
        setIngredients(temp_ingredients);
    }

    return (
        <div>
            <input type='text' placeholder='2' size='10' onChange={handleFormChange} value={ingredient.amount||""} name='amount'/>
            <select name='unit_dropdown' onChange={handleFormChange}>
                <option value='' disabled={true} selected={!ingredient.unit_dropdown}>No Unit</option>
                {units.map((unit) => {
                    return <option value={unit} selected={ingredient.unit_dropdown === unit}>{unit}</option>
                })}
                <option value='custom' selected={ingredient.unit_dropdown === 'custom'}>Custom</option>
            </select>
            {ingredient.unit_dropdown === "custom" && <input type='text' placeholder='oz' size='10' onChange={handleFormChange} value={ingredient.unit||""} name='unit'/>}
            <select name='ingredient' onChange={handleFormChange}>
                <option value='' disabled={true} selected={!ingredient.ingredient}>Select Ingredient</option>
                {allIngredients.map((ingredientOption)=>{
                    return <option value={ingredientOption.uuid} selected={ingredient.ingredient === ingredientOption.name}>{ingredientOption.name}</option>
                })}
            </select>

            {(index === ingredients.length - 1) && <FaMinus style={{marginLeft: "5px"}}
                onClick={() =>{setIngredients(ingredients.slice(0, -1))}}/>}
        </div>
    )
}

export default IngredientEntry;