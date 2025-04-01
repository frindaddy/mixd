import React, {useEffect, useState} from "react"
import {FaEdit, FaSearch} from "react-icons/fa";
import axios from "axios";
import "../../format/MyBarTab.css";
import {useNavigate} from "react-router-dom";
import IngredientCategories from "../../definitions/IngredientCategories";

const MyBarTab = ({setUserDrinksReq, user}) => {
    const [ingredients, setIngredients] = useState([]);
    const [userIngredients, setUserIngredients] = useState(null);
    const [editUserIngr, setEditUserIngr] = useState(false);
    const [searchSettings, setSearchSettings] = useState({tol: 0, no_na: false, strict: false});

    const navigate = useNavigate();

    useEffect(() => {
        fetchIngredients();
        if(user.user_id) get_user_ingredients();
    }, []);

    const fetchIngredients = () => {
        axios.get('/api/get_ingredients')
            .then((res) => {
                if (res.data) {
                    setIngredients(res.data);
                }
            }).catch((err) => console.log(err));
    }

    function get_user_ingredients(){
        axios.get('/api/user_ingredients/'+user.user_id).then(res =>{
            if(res.data && res.data.available_ingredients) {
                setUserIngredients(res.data.available_ingredients);
                setSearchSettings({...searchSettings, user_id: user.user_id});
            }
        }).catch((err) => console.log(err));
    }

    const onIngredientClick = (ingredient, onHand) => {
        if(editUserIngr) {
            axios.post('/api/user_ingredients', {user_id: user.user_id, ingr_uuid: ingredient.uuid, delete: onHand}).then(res =>{
                if(res.data && res.data.available_ingredients){
                    setUserIngredients(res.data.available_ingredients);
                }
            });
        }
    };

    function search_user_drinks(){
        if(searchSettings.user_id){
            setUserDrinksReq(searchSettings);
            navigate('/');
        }
    }
//ingredient.count > 0 && <IngredientListEntry ingredient={ingredient} onIngredientClick={onIngredientClick} userOnHand={userIngredients !== null && userIngredients.includes(ingredient.uuid)} />
    return (
        <>
            <div>
                <div style={{display: "flex", justifyContent: "center", alignItems:"center", marginRight:"53px"}}>
                    <FaEdit className="sorted-filter-icon" style={{backgroundColor: editUserIngr? "3B3D3F":"", cursor:'pointer'}} onClick={()=>{setEditUserIngr(!editUserIngr)}}/>
                    <h1 className="ingredient-title">My Bar</h1>
                </div>
                {IngredientCategories.map((category) =>{
                    let category_ingr = ingredients.filter(ingr => ingr.category === category.name);
                    if(category_ingr.length === 0) return <></>
                    return <div>
                        <h2>{category.localization}</h2>
                        <div className="tag-container">
                            {category_ingr.map(ingredient => {
                                let onHand = userIngredients !== null && userIngredients.includes(ingredient.uuid);
                                return <div className={"tag clickable unselectable"+(onHand ? '':' unselected-tag-filter')}
                                            style={onHand ? {backgroundColor: 'green'}:{}}>{ingredient.name}</div>
                            })}
                        </div>
                    </div>;
                })}
            </div>
            <div style={{display: "flex", justifyContent: "center"}}>
                <div>
                    {user.user_id !== undefined && <div>
                        <br />
                        <div>
                            <span>Allowed Missing Ingredients:  </span>
                            <select onChange={(e)=> setSearchSettings({...searchSettings, tol: e.target.value})}>
                                {[0,1,2,3,4,5].map(index=> {
                                    return <option value={index} selected={searchSettings.tol === index}>{index}</option>;
                                })}
                            </select>
                        </div>
                        <div>
                            <span>Ignore NA Ingredients:  </span>
                            <input type='checkbox' checked={searchSettings.no_na} onChange={(e)=> setSearchSettings({...searchSettings, no_na: e.target.checked})}></input>
                        </div>
                        <div>
                            <span>Exact Search:  </span>
                            <input type='checkbox' checked={searchSettings.strict} onChange={(e)=> setSearchSettings({...searchSettings, strict: e.target.checked})}></input>
                        </div>
                        <div>
                            <FaSearch className="sorted-filter-icon" style={{cursor:'pointer', marginTop:'15px'}} onClick={search_user_drinks}/>
                        </div>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default MyBarTab;