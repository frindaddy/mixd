import React, {useEffect, useState} from "react"
import {FaChevronLeft} from "react-icons/fa";
import axios from "axios";
import GlassTypes from "./GlassTypes";
import TagEntryContainer from "./TagEntryContainer";
import IngredientEntryContainer from "./IngredientEntryContainer";
const ManageIngredients = ({setCurrentPage, adminKey}) => {
    const [newIngredientName, setNewIngredientName] = useState("");
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        axios.get('api/get_ingredients')
            .then((res) => {
                if (res.data) {
                    setIngredients(res.data)
                }
            }).catch((err) => console.log(err));
    }, []);

    const handleFormChange = (event) => {
        setNewIngredientName(event.target.value);
    }

    async function postIngredient(ingredientName) {
        const response = await axios.post('./api/add_ingredient', {name: ingredientName}, {
                headers: {
                    Authorization: `Bearer ${adminKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        if(response.status !== 200) {
            //TODO: Add errors back.
            //setErrorMsg('Failed to add drink. Internal server error '+response.status);
        } else {
            setCurrentPage('drinkList');
        }
    }
    async function deleteIngredient(ingredientID) {
        /*
        axios.delete('api/drink/'+drinkID+(sameImage ? '?saveImg=true':''), {headers:{Authorization: `Bearer ${adminKey}`}})
            .then((res) => {
                if (res.data) {
                    console.log(res.data[0]);
                }
            }).catch((err) => console.log(err));

         */
        //TODO: Add this
    }

    return (
        <div className='add-new-drink'>
            <nav>
                <div className="nav-container">
                    <a href="/" className="back" onClick={()=>{setCurrentPage('drinkList')}} style={{cursor: "pointer"}}><FaChevronLeft/></a>
                    <div className="nav-logo">mixd.</div>
                </div>
            </nav>
            <div>
                <h1 className="create-drink-title">Manage Ingredients</h1>
                <p>Add Ingredient:</p>
                <div className="create-drink-row">
                    <input type="text" name="ingredientName" placeholder="Lime Juice" value={newIngredientName || ""} onChange={handleFormChange} />
                </div>
                <div className="create-drink-row">
                    <button onClick={()=>{postIngredient(newIngredientName)}}>Add Ingredient</button>
                </div>
                {ingredients.map((ingredient) =>{
                    return <p>{ingredient.name}</p>
                })}
            </div>
        </div>
    )
}

export default ManageIngredients;