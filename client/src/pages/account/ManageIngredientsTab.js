import React, {useEffect, useState} from "react"
import {FaTrash, FaSearch} from "react-icons/fa";
import axios from "axios";
import {FaPenToSquare, FaCheck, FaXmark} from "react-icons/fa6";
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
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUuid, setEditingUuid] = useState(null);
    const [editData, setEditData] = useState({name: '', abv: 0, category: ''});

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

    function validateABV(abv) {
        if(abv === undefined || abv === "" || abv === "0"){
            abv = 0
        } else {
            try {
                abv = parseFloat(abv)
                if (isNaN(abv)) abv = 0
            } catch (e) {
                abv = 0
            }
        }
        return abv
    }

    const handleEditStart = (ingredient) => {
        setEditingUuid(ingredient.uuid);
        setEditData({
            name: ingredient.name,
            abv: ingredient.abv || 0,
            category: ingredient.category || 'misc'
        });
    }

    const handleEditCancel = () => {
        setEditingUuid(null);
        setEditData({name: '', abv: 0, category: ''});
    }

    const handleEditSave = async () => {
        const abv = validateABV(editData.abv);
        const response = await axios.post('/api/update_ingredient', 
            {uuid: editingUuid, name: editData.name, abv: abv, category: editData.category}, 
            {
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
            setEditingUuid(null);
            fetchIngredients();
        }
    }

    async function postIngredient(ingredientName, abv, category) {
        abv = validateABV(abv)
        if(category === "" || category === "none" || category === undefined) category = 'misc';
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
        }
    }

    const filteredIngredients = ingredients.filter(ing => 
        ing.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-ingredients-tab">
            <h1 className="tab-title">Manage Ingredients</h1>
            {errorMsg && errorMsg !== '' && <p className="error-msg">{"ERROR: "+errorMsg}</p>}
            
            <div className="add-ingredient-section">
                <p className="section-label">Add Ingredient:</p>
                <div className="manage-ingredients-row">
                    <input type="text" className="add-name" placeholder="Lime Juice" value={newIngredientName || ""}
                           onChange={e => setNewIngredientName(e.target.value)}/>
                    <div className="abv-container">
                        <input type="number" className="add-abv" placeholder="0" value={newIngredientABV || ""}
                            onChange={e => setNewIngredientABV(e.target.value)}/>
                        <span className="unit">%</span>
                    </div>
                    <select className="add-category" value={newIngredientCategory} onChange={(e)=>setNewIngredientCategory(e.target.value)}>
                        <option value='none' disabled={true}>Category</option>
                        {IngredientCategories.map(category => {
                            return <option key={category.name} value={category.name}>{category.localization}</option>
                        })}
                    </select>
                    <button className="add-button" onClick={()=>{postIngredient(newIngredientName, newIngredientABV, newIngredientCategory)}}>Add</button>
                </div>
            </div>

            <div className="ingredients-list-section">
                <div className="search-container">
                    <div className="search-bar-wrapper">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Search ingredients..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {IngredientCategories.map(category => {
                    const categoryIngredients = filteredIngredients.filter(ing => ing.category === category.name);
                    if (categoryIngredients.length === 0) return null;

                    return (
                        <div key={category.name} className="category-group">
                            <h2 className="category-header">{category.header}</h2>
                            {categoryIngredients.map((ingredient) => (
                                <div key={ingredient.uuid} className={`ingredient-row ${editingUuid === ingredient.uuid ? 'editing' : ''}`}>
                                    {editingUuid === ingredient.uuid ? (
                                        <>
                                            <input 
                                                type="text" 
                                                value={editData.name} 
                                                onChange={(e) => setEditData({...editData, name: e.target.value})}
                                                className="edit-name"
                                            />
                                            <div className="abv-container">
                                                <input 
                                                    type="number" 
                                                    value={editData.abv} 
                                                    onChange={(e) => setEditData({...editData, abv: e.target.value})}
                                                    className="edit-abv"
                                                />
                                                <span className="unit">%</span>
                                            </div>
                                            <select 
                                                value={editData.category} 
                                                onChange={(e) => setEditData({...editData, category: e.target.value})}
                                                className="edit-category"
                                            >
                                                {IngredientCategories.map(cat => (
                                                    <option key={cat.name} value={cat.name}>{cat.localization}</option>
                                                ))}
                                            </select>
                                            <div className="action-buttons">
                                                <FaCheck className="action-icon save" onClick={handleEditSave} title="Save" />
                                                <FaXmark className="action-icon cancel" onClick={handleEditCancel} title="Cancel" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="ingredient-name" style={{color: unusedIngredients.includes(ingredient.uuid) ? "#ff6b6b" : "white"}}>
                                                {ingredient.name}
                                            </span>
                                            <span className="ingredient-abv">{ingredient.abv}%</span>
                                            <div className="action-buttons">
                                                <FaPenToSquare className="action-icon edit" onClick={() => handleEditStart(ingredient)} title="Edit" />
                                                {unusedIngredients.includes(ingredient.uuid) && (
                                                    <FaTrash className="action-icon delete" onClick={() => confirmDeleteIngredient(ingredient.uuid, ingredient.name)} title="Delete" />
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default ManageIngredientsTab;