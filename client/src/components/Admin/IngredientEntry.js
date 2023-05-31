import React, { useState } from "react"
import {FaMinus} from "react-icons/fa";

const categories = ['Spirit', 'Style','Taste', 'Mix', 'Color', 'Season', 'Temp', 'Misc'];

const IngredientEntry = ({index, ingredients, setIngredients}) => {
    const [ingredient, setIngredient] = useState({});

    function handleFormChange(e) {
        let new_ingredient = {...ingredient, [e.target.name]:e.target.value};
        let temp_ingredients = ingredients;
        temp_ingredients[index] = new_ingredient;
        setIngredient(new_ingredient);
        setIngredients(temp_ingredients);
    }

    return (
        <div>
            <input type='text' placeholder='1' onChange={handleFormChange} value={ingredient.amount||""} name='amount'/>
            <input type='text' placeholder='oz' onChange={handleFormChange} value={ingredient.unit||""} name='unit'/>
            <input type='text' placeholder='Gin' onChange={handleFormChange} value={ingredient.ingredient||""} name='ingredient'/>
            {(index === ingredients.length - 1) && <FaMinus style={{marginLeft: "10px", marginRight: "10px", marginTop: "0px"}} onClick={() =>{setIngredients(ingredients.slice(0, -1))}}/>}
        </div>
    )
}

export default IngredientEntry;