import React, {useEffect, useState} from "react"
import {FaPercent, FaPlus, FaTrash} from "react-icons/fa";
import axios from "axios";
import {FaPenToSquare} from "react-icons/fa6";
import '../../format/ManageIngredients.css';

const ManageIngredients = ({adminKey}) => {
    const [newIngredientName, setNewIngredientName] = useState("");
    const [newIngredientABV, setNewIngredientABV] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [unusedIngredients, setUnusedIngredients] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        document.title = 'Manage Ingredients | mixd.';
        fetchIngredients();
        axios.get('/api/users').then(res => {
            if(res.data){
                setUsers(res.data);
            }
        }).catch((err) => console.log(err));
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

    async function postIngredient(ingredientName, abv) {
        abv = validateABV(abv)
        const response = await axios.post('/api/add_ingredient', {name: ingredientName, abv: abv}, {
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

    function create_user() {
        setUsers([...users, 'Creating user...']);
        axios.post('/api/create_user', {}, {
                headers: {
                    Authorization: `Bearer ${adminKey}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            if(res.data && res.data.user_id){
                let new_users = [...users]
                new_users[new_users.length - 1] = res.data.user_id
                setUsers(new_users);
            }
        }).catch((err) => {
            let new_users = [...users]
            new_users.pop();
            setUsers(new_users);
            setErrorMsg('Failed to create user. Internal server error '+err.response.status);
        });
    }

    function confirmDeleteUser(userID) {
        if(window.confirm('Are you sure you want to delete user \''+userID+'\'?') === true){
            axios.delete('/api/user/'+userID, {headers:{Authorization: `Bearer ${adminKey}`}})
                .then(() => {
                    setUsers(users.filter(user => user !== userID));
                }).catch((err) => {
                setErrorMsg('Failed to delete user. Internal server error '+err.response.status);
            });
        } else {
            alert('User not deleted.');
        }
    }

    return (
        <div>
            <h1 className="manage-ingredients-title">Manage Ingredients</h1>
            {errorMsg && errorMsg !== '' && <p style={{color:"red"}}>{"ERROR: "+errorMsg}</p>}
            <p style={{display:"flex", justifyContent:"center", marginTop:"-10px", marginBottom:"-10px"}}>Add Ingredient:</p>
            <div className="manage-ingredients-row">
                <input type="text" style={{width:"150px"}} name="ingredientName" placeholder="Lime Juice" value={newIngredientName || ""}
                       onChange={e => setNewIngredientName(e.target.value)}/>
                <input type="number" style={{width:"40px"}} name="ingredientABV" placeholder="0" value={newIngredientABV || ""}
                       onChange={e => setNewIngredientABV(e.target.value)}/>
                <button onClick={()=>{postIngredient(newIngredientName, newIngredientABV)}}>Add Ingredient</button>
            </div>
            <h1 className="manage-ingredients-title" style={{marginTop:"20px", marginBottom:"-10px"}}>Current Ingredients:</h1>
            {ingredients.map((ingredient) =>{
                return <div>
                    <div style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
                        <span className="manage-ingredients-entry" style={{color: unusedIngredients.includes(ingredient.uuid) ? "red":"white"}}>{ingredient.name + ' ('+ingredient.abv+'%)'}</span>
                        <FaPenToSquare className="edit-ingredient" onClick={()=>{renameIngredient(ingredient.uuid, prompt("Rename '"+ingredient.name+"' to:", ingredient.name))}}/>
                        <FaPercent className="edit-ingredient" onClick={()=>{changeABV(ingredient.uuid, prompt("Change abv of '"+ingredient.name+"' to:", ingredient.abv?ingredient.abv:0))}}/>
                        {unusedIngredients.includes(ingredient.uuid) && <FaTrash className="edit-ingredient" onClick={()=>{confirmDeleteIngredient(ingredient.uuid, ingredient.name)}}/>}
                    </div>
                </div>
            })}
            <h1 className="manage-ingredients-title" style={{marginTop:"20px", marginBottom:"-10px"}}>Manage Users</h1>
            {users.map((user) =>{
                return <div>
                    <div style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
                        <span className="manage-ingredients-entry">{user}</span>
                        {typeof user === "number" && <FaTrash style={{marginLeft:'10px', cursor:'pointer'}} onClick={()=>{confirmDeleteUser(user)}}/>}
                    </div>
                </div>
            })}
            <div style={{display: "flex", justifyContent: "center", alignItems:"center", marginTop:"10px"}}><FaPlus style={{cursor:'pointer'}} onClick={create_user}/></div>
        </div>
    )
}

export default ManageIngredients;