import React, {useEffect, useState} from "react"
import {FaPercent, FaTag, FaTrash} from "react-icons/fa";
import axios from "axios";
import {FaPenToSquare} from "react-icons/fa6";
import '../../format/ManageIngredientsTab.css';
import '../../format/Tabs.css';
import IngredientCategories from "../../definitions/IngredientCategories";

const ManageIngredientsTab = ({adminKey}) => {
    const [newIngredientName, setNewIngredientName] = useState("");
    const [newIngredientABV, setNewIngredientABV] = useState("");
    const [newIngredientCategory, setNewIngredientCategory] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [unusedIngredients, setUnusedIngredients] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = () => {
        axios.get('/api/get_ingredients')
            .then((res) => {
                if (res.data) {
                    setIngredients(res.data)
                }
            }).catch((err) => console.log(err));
        axios.get('/api/unused_ingredients')
            .then((res) => {
                if (res.data) {
                    setUnusedIngredients(res.data)
                }
            }).catch((err) => console.log(err));
    }

    async function renameIngredient(uuid, newName) {
        if(newName && newName.length > 0){
            const response = await axios.post('/api/update_ingredient', {uuid: uuid, name: newName}, {
                    headers: {
                        Authorization: `Bearer ${adminKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if(response.status !== 200) {
                setErrorMsg('Failed to update ingredient. Internal server error '+response.status);
            } else {
                setErrorMsg('');
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
            const response = await axios.post('/api/update_ingredient', {uuid: uuid, abv: abv}, {
                    headers: {
                        Authorization: `Bearer ${adminKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if(response.status !== 200) {
                setErrorMsg('Failed to update ingredient. Internal server error '+response.status);
            } else {
                setErrorMsg('');
                fetchIngredients();
            }
        }
    }

    async function changeCategory(uuid, category) {
        if(category !== ""){
            const response = await axios.post('/api/update_ingredient', {uuid: uuid, category: category}, {
                    headers: {
                        Authorization: `Bearer ${adminKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if(response.status !== 200) {
                setErrorMsg('Failed to update ingredient. Internal server error '+response.status);
            } else {
                setErrorMsg('');
                fetchIngredients();
            }
        }
    }

    async function postIngredient(ingredientName, abv, category) {
        abv = validateABV(abv)
        if(category === "" || category === undefined) category = 'misc';
        const response = await axios.post('/api/add_ingredient', {name: ingredientName, abv: abv, category: category}, {
                headers: {
                    Authorization: `Bearer ${adminKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        if(response.status !== 200) {
            setErrorMsg('Failed to add ingredient. Internal server error '+response.status);
        } else {
            setErrorMsg('');
            setNewIngredientName("")
            setNewIngredientABV("")
            fetchIngredients();
        }
    }

    function confirmDeleteIngredient(ingredientID, ingredientName) {
        if(window.confirm('Are you sure you want to delete \''+ingredientName+'\'?') === true){
            axios.delete('/api/ingredient/'+ingredientID, {headers:{Authorization: `Bearer ${adminKey}`}})
                .then((res) => {
                    setIngredients(ingredients.filter(ing => ing.uuid !== ingredientID));
                }).catch((err) => console.log(err));
        } else {
            alert('Ingredient not deleted.');
        }
    }

    return (
        <>
            <h1 className="tab-title">Manage Ingredients</h1>
            {errorMsg && errorMsg !== '' && <p style={{color:"red"}}>{"ERROR: "+errorMsg}</p>}
            <p style={{textAlign:"center", fontSize:"20px", fontWeight:"300", marginBottom:"-5px"}}>Add Ingredient:</p>
            <div className="manage-ingredients-row">
                <input type="text" style={{width:"150px"}} name="ingredientName" placeholder="Lime Juice" value={newIngredientName || ""}
                       onChange={e => setNewIngredientName(e.target.value)}/>
                <input type="number" style={{width:"40px"}} name="ingredientABV" placeholder="0" value={newIngredientABV || ""}
                       onChange={e => setNewIngredientABV(e.target.value)}/>
                <select onChange={(e)=>setNewIngredientCategory(e.target.value)}>
                    <option value='none' disabled={true} selected={newIngredientCategory === ''}>None</option>
                    {IngredientCategories.map(category => {
                        return <option value={category.name} selected={newIngredientCategory === category.name}>{category.localization}</option>
                    })}
                </select>
                <button onClick={()=>{postIngredient(newIngredientName, newIngredientABV, newIngredientCategory)}}>Add Ingredient</button>
            </div>
            <h1 className="tab-subtitle">Current Ingredients:</h1>
            {ingredients.map((ingredient) =>{
                return <div style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
                    <span className="manage-ingredients-entry" style={{color: unusedIngredients.includes(ingredient.uuid) ? "red":"white"}}>{ingredient.name + ' ('+ingredient.abv+'%)'+ ' ('+ingredient.category+')'}</span>
                    <FaPenToSquare className="edit-ingredient" onClick={()=>{renameIngredient(ingredient.uuid, prompt("Rename '"+ingredient.name+"' to:", ingredient.name))}}/>
                    <FaPercent className="edit-ingredient" onClick={()=>{changeABV(ingredient.uuid, prompt("Change abv of '"+ingredient.name+"' to:", ingredient.abv?ingredient.abv:0))}}/>
                    <FaTag className="edit-ingredient" onClick={()=>{changeCategory(ingredient.uuid, newIngredientCategory)}} />
                    {unusedIngredients.includes(ingredient.uuid) && <FaTrash className="edit-ingredient" onClick={()=>{confirmDeleteIngredient(ingredient.uuid, ingredient.name)}}/>}
                </div>
            })}
        </>
    )
}

export default ManageIngredientsTab;