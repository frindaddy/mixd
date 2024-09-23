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
                    <button onClick={()=>{postIngredient(newIngredientName)}}>Add Ingredient</button>
                </div>
                <h1 className="create-drink-title" style={{paddingBottom: "10px"}}>Current Ingredients:</h1>
                {ingredients.map((ingredient) =>{
                    return <div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <span style={{color: unusedIngredients.includes(ingredient.uuid) ? "red":"white"}}>{ingredient.name + " ("+ingredient.uuid+")"}</span>
                            <FaPenToSquare onClick={()=>{renameIngredient(ingredient.uuid, prompt("Rename '"+ingredient.name+"' to:", ingredient.name))}}
                                style={{cursor: "pointer", "padding-left": "10px"}} />
                            <FaTrash onClick={()=>{confirmDeleteIngredient(ingredient.uuid, ingredient.name)}}
                                style={{cursor: "pointer", "padding-left": "10px"}} />
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default ManageIngredients;