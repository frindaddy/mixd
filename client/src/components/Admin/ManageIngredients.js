import React, {useEffect, useState} from "react"
import {FaChevronLeft, FaPercent, FaTrash} from "react-icons/fa";
import axios from "axios";
import {FaPenToSquare} from "react-icons/fa6";
import '../../format/ManageIngredients.css';

const ManageIngredients = ({setCurrentPage, adminKey}) => {
    const [newIngredientName, setNewIngredientName] = useState("");
    const [newIngredientABV, setNewIngredientABV] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [unusedIngredients, setUnusedIngredients] = useState([]);

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = () => {
        axios.get('api/get_ingredients')
            .then((res) => {
                if (res.data) {
                    setIngredients(res.data)
                }
            }).catch((err) => console.log(err));
        axios.get('api/unused_ingredients')
            .then((res) => {
                if (res.data) {
                    setUnusedIngredients(res.data)
                }
            }).catch((err) => console.log(err));
    }

    async function renameIngredient(uuid, newName) {
        if(newName && newName.length > 0){
            const response = await axios.post('./api/update_ingredient', {uuid: uuid, name: newName}, {
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
                fetchIngredients();
            }
        }
    }

    function validateABV(abv) {
        if(abv === undefined || abv === "" || abv === "0"){
            abv = 0
        } else {
            try {
                abv = parseFloat(abv)
                if (typeof (abv) !== "number") abv = 0
            } catch (e) {
                abv = 0
            }
        }
        return abv
    }

    async function changeABV(uuid, abv) {
        abv = validateABV(abv)
        if(abv !== undefined){
            const response = await axios.post('./api/update_ingredient', {uuid: uuid, abv: abv}, {
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
                fetchIngredients();
            }
        }
    }

    async function postIngredient(ingredientName, abv) {
        abv = validateABV(abv)
        const response = await axios.post('./api/add_ingredient', {name: ingredientName, abv: abv}, {
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
            setNewIngredientName("")
            setNewIngredientABV("")
            fetchIngredients();
        }
    }

    function confirmDeleteIngredient(ingredientID, ingredientName) {
        if(window.confirm('Are you sure you want to delete \''+ingredientName+'\'?') === true){
            axios.delete('api/ingredient/'+ingredientID, {headers:{Authorization: `Bearer ${adminKey}`}})
                .then((res) => {
                    setIngredients(ingredients.filter(ing => ing.uuid !== ingredientID));
                }).catch((err) => console.log(err));
        } else {
            alert('Ingredient not deleted.');
        }
    }

    return (
        <div>
            <nav>
                <div className="nav-container">
                    <a href="/" className="back" onClick={()=>{setCurrentPage('drinkList')}} style={{cursor: "pointer"}}><FaChevronLeft/></a>
                    <div className="nav-logo">mixd.</div>
                </div>
            </nav>
            <div>
                <h1 className="manage-ingredients-title" style={{paddingBottom: "20px"}}>Manage Ingredients</h1>
                <p style={{display:"flex", justifyContent:"center", marginTop:"-10px", marginBottom:"-10px"}}>Add Ingredient:</p>
                <div className="manage-ingredients-row">
                    <input type="text" name="ingredientName" placeholder="Lime Juice" value={newIngredientName || ""} onChange={e => setNewIngredientName(e.target.value)} />
                    <input type="number" name="ingredientABV" placeholder="0" value={newIngredientABV || ""} onChange={e => setNewIngredientABV(e.target.value)} />
                    <button onClick={()=>{postIngredient(newIngredientName, newIngredientABV)}}>Add Ingredient</button>
                </div>
                <h1 className="manage-ingredients-title" style={{paddingBottom: "10px"}}>Current Ingredients:</h1>
                {ingredients.map((ingredient) =>{
                    return <div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <span style={{color: unusedIngredients.includes(ingredient.uuid) ? "red":"white"}}>{ingredient.name + ' ('+ingredient.abv+'%)'}</span>
                            <FaPenToSquare onClick={()=>{renameIngredient(ingredient.uuid, prompt("Rename '"+ingredient.name+"' to:", ingredient.name))}}
                                style={{cursor: "pointer", "padding-left": "10px"}} />
                            <FaPercent onClick={()=>{changeABV(ingredient.uuid, prompt("Change abv of '"+ingredient.name+"' to:", ingredient.abv?ingredient.abv:0))}}
                                           style={{cursor: "pointer", "padding-left": "10px"}} />
                            {unusedIngredients.includes(ingredient.uuid) && <FaTrash onClick={()=>{confirmDeleteIngredient(ingredient.uuid, ingredient.name)}}
                                style={{cursor: "pointer", "padding-left": "10px"}} />}
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default ManageIngredients;