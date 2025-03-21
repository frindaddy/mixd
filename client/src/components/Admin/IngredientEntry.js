import React, {useEffect, useState} from "react"
import {FaMinus, FaArrowUp, FaArrowDown} from "react-icons/fa";

const IngredientEntry = ({index, ingredients, setIngredients, allIngredients, swapIngredients}) => {
    const [ingredient, setIngredient] = useState({});
    const units = ['oz']

    useEffect(() => {
        if(ingredients[index].unit && ingredients[index].ingredient){
            let dropdown = ingredients[index].unit
            if(!units.includes(dropdown) && dropdown !== undefined) dropdown = 'custom'
            setIngredient({amount: ingredients[index].amount, unit: ingredients[index].unit, ingredient: ingredients[index].ingredient, unit_dropdown: dropdown})
        } else {
            setIngredient({});
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
        <div style={{display: "flex", width: "100%"}}>
            {index !== 0 && <FaArrowUp style={{padding: '0px 3px', cursor: 'pointer'}} onClick={()=>{swapIngredients(index, index-1)}} />}
            {index === 0 && <span style={{padding: '0px 10.75px'}} />}
            {index !== ingredients.length-1 && <FaArrowDown style={{padding: '0px 3px', cursor: 'pointer'}} onClick={()=>{swapIngredients(index, index+1)}} />}
            {index === ingredients.length-1 && <span style={{padding: '0px 11.75px'}} />}
            <input type='text' placeholder='2' style={{width: '36px'}} onChange={handleFormChange} value={ingredient.amount||""} name='amount'/>
            <select name='unit_dropdown' onChange={handleFormChange}>
                <option value='' disabled={true} selected={!ingredient.unit_dropdown}>No Unit</option>
                {units.map((unit) => {
                    return <option value={unit} selected={ingredient.unit_dropdown === unit}>{unit}</option>
                })}
                <option value='custom' selected={ingredient.unit_dropdown === 'custom'}>Custom</option>
            </select>
            {ingredient.unit_dropdown === "custom" && <input type='text' placeholder='oz' size='5' onChange={handleFormChange} value={ingredient.unit||""} name='unit'/>}
            <select name='ingredient' onChange={handleFormChange} style={(ingredient.unit_dropdown === "custom" ? {width:"36%"}:{width: "50%"})}>
                <option value='' disabled={true} selected={!ingredient.ingredient}>Select Ingredient</option>
                {allIngredients.map((ingredientOption)=>{
                    return <option value={ingredientOption.uuid} selected={ingredient.ingredient === ingredientOption.name || ingredient.ingredient === ingredientOption.uuid}>{ingredientOption.name}</option>
                })}
            </select>

            {(index === ingredients.length - 1) && <FaMinus style={{marginLeft: "5px"}}
                onClick={() =>{setIngredients(ingredients.slice(0, -1))}}/>}
        </div>
    )
}

export default IngredientEntry;