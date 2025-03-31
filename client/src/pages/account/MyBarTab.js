import React, {useEffect, useState} from "react"
import {FaEdit, FaSearch, FaSortAmountDown} from "react-icons/fa";
import axios from "axios";
import IngredientListEntry from "../../components/Ingredients/IngredientListEntry";
import "../../format/MyBarTab.css";
import {useNavigate} from "react-router-dom";

const MyBarTab = ({setIngrFilter, setUserDrinksReq, user, setUser}) => {
    const [ingredients, setIngredients] = useState([]);
    const [sortedIngredients, setSortedIngredients] = useState([]);
    const [sorted, setSorted] = useState(false);
    const [userIngredients, setUserIngredients] = useState(null);
    const [editUserIngr, setEditUserIngr] = useState(false);
    const [searchSettings, setSearchSettings] = useState({tol: 0, no_na: false, strict: false});
    const [sortSetting, setSortSetting] = useState(0)

    const navigate = useNavigate();

    useEffect(() => {
        fetchIngredients();
        if(user.user_id) get_user_ingredients();
    }, []);

    const fetchIngredients = () => {
        axios.get('/api/count_ingredients')
            .then((res) => {
                if (res.data) {
                    setIngredients(res.data);
                    const clone = res.data.map( x => { return {...x}} )
                    setSortedIngredients(clone.sort((a, b) => {
                        if(a.count > b.count) return -1;
                        if(a.count < b.count) return 1;
                        return 0;
                    }));
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
        } else {
            setIngrFilter([ingredient.uuid, ingredient.name])
            navigate('/');
        }
    };

    function search_user_drinks(){
        if(searchSettings.user_id){
            setUserDrinksReq(searchSettings);
            navigate('/');
        }
    }

    return (
        <>
            <h1>My Bar</h1>
            <div>
                <div style={{display: "flex", justifyContent: "center", alignItems:"center", marginRight:"53px"}}>
                    <FaSortAmountDown className="sorted-filter-icon" style={{backgroundColor: sorted? "3B3D3F":""}} onClick={()=>{setSorted(!sorted)}}/>
                    <h1 className="ingredient-title">Ingredients</h1>
                    <FaEdit className="sorted-filter-icon" style={{backgroundColor: editUserIngr? "3B3D3F":"", cursor:'pointer'}} onClick={()=>{setEditUserIngr(!editUserIngr)}}/>
                </div>
                <div style={{display:"flex", justifyContent:"center"}}>
                    <p>Sort by:</p>
                    <select onChange={(e)=> setSortSetting(e.target.value)}>
                        <option value={0}>Alphabetical</option>
                        <option value={1}>Most used</option>
                        <option value={2}>My ingredients</option>
                    </select>
                </div>
                {(sorted ? sortedIngredients:ingredients).map((ingredient) =>{
                    return <div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            {ingredient.count > 0 && <IngredientListEntry ingredient={ingredient} onIngredientClick={onIngredientClick} userOnHand={userIngredients !== null && userIngredients.includes(ingredient.uuid)} />}
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