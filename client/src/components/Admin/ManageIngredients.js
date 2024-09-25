import React, {useEffect, useState} from "react"
import {FaChevronLeft, FaTrash} from "react-icons/fa";
import axios from "axios";
import {FaPenToSquare} from "react-icons/fa6";

const ManageIngredients = ({setCurrentPage, adminKey}) => {
    const [newIngredientName, setNewIngredientName] = useState("");
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

    const handleFormChange = (event) => {
        setNewIngredientName(event.target.value);
    }

    async function renameIngredient(uuid, newName) {
        if(newName && newName.length > 0){
            const response = await axios.post('./api/rename_ingredient', {uuid: uuid, name: newName}, {
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
            setNewIngredientName("")
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
        <div className='add-new-drink'>
            <nav>
                <div className="nav-container">
                    <a href="/" className="back" onClick={()=>{setCurrentPage('drinkList')}} style={{cursor: "pointer"}}><FaChevronLeft/></a>
                    <div className="nav-logo">mixd.</div>
                </div>
            </nav>
            <div>
                <h1 className="create-drink-title" style={{paddingBottom: "20px"}}>Manage Ingredients</h1>
                <p>Add Ingredient:</p>
                <div className="create-drink-row">
                    <input type="text" name="ingredientName" placeholder="Lime Juice" value={newIngredientName || ""} onChange={handleFormChange} />
                    <select name="parent">
                        <option>Spirit</option>
                        <option>Liqueur</option>
                        <option>Syrup</option>
                        <option>Misc.</option>
                    </select>
                    <button onClick={()=>{postIngredient(newIngredientName)}}>Add Ingredient</button>
                </div>
                <h1 className="create-drink-title">Current Ingredients:</h1>
                <div style={{display: "table", width: "100%"}}>
                    <div style={{display: "table-row-group"}}>
                        <div style={{display: "table-row"}}>
                            <div className="ingredient-category-manage-list">Spirits 
                                <div className="ingredient-parent-manage-list">Gin</div>
                                    <div className="ingredient-manage-list">Beefeater</div>
                                    <div className="ingredient-manage-list">Empress</div>
                                    <div className="ingredient-manage-list">Hendricks</div>
                                    <div className="ingredient-manage-list">Monkey 47</div>
                                <div className="ingredient-parent-manage-list">Rum</div>
                                    <div className="ingredient-manage-list">Bacardi</div>
                                    <div className="ingredient-manage-list">Diplimatico</div>
                            </div>
                            <div className="ingredient-category-manage-list">Liqueurs
                                <div className="ingredient-manage-list">Green Chartruese</div>
                                <div className="ingredient-manage-list">St. Germain</div>
                            </div>
                            <div className="ingredient-category-manage-list">Syrups
                                <div className="ingredient-manage-list">Grenadine</div>
                                <div className="ingredient-manage-list">Symple Syrup</div>
                            </div>
                            <div className="ingredient-category-manage-list">Misc.
                                <div className="ingredient-manage-list">Egg White</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 
                {ingredients.map((ingredient) =>{
                    return <div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <span style={{color: unusedIngredients.includes(ingredient.uuid) ? "red":"white"}}>{ingredient.name}</span>
                            <FaPenToSquare onClick={()=>{renameIngredient(ingredient.uuid, prompt("Rename '"+ingredient.name+"' to:", ingredient.name))}}
                                style={{cursor: "pointer", "padding-left": "10px"}} />
                            {unusedIngredients.includes(ingredient.uuid) && <FaTrash onClick={()=>{confirmDeleteIngredient(ingredient.uuid, ingredient.name)}}
                                style={{cursor: "pointer", "padding-left": "10px"}} />}
                        </div>
                    </div>
                })}
                 */}
            </div>
        </div>
    )
}

export default ManageIngredients;