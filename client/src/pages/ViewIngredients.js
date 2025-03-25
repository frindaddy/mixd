import React, {useEffect, useState} from "react"
import {FaCheck, FaEdit, FaSearch, FaSortAmountDown} from "react-icons/fa";
import axios from "axios";
import IngredientListEntry from "../components/Ingredients/IngredientListEntry";
import "../format/ViewIngredients.css";
import {useNavigate} from "react-router-dom";

const ViewIngredients = ({setIngrFilter, setUserDrinksReq}) => {
    const [ingredients, setIngredients] = useState([]);
    const [sortedIngredients, setSortedIngredients] = useState([]);
    const [sorted, setSorted] = useState(false);
    const [user, setUser] = useState(null);
    const [userIngredients, setUserIngredients] = useState(null);
    const [editUserIngr, setEditUserIngr] = useState(false);
    const [searchSettings, setSearchSettings] = useState({tol: 0, strict: false});

    const navigate = useNavigate();


    useEffect(() => {
        document.title = 'Ingredients | mixd.';
        fetchIngredients();
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
        if(user && typeof user === "number" && user > 10000){
            axios.get('/api/user_ingredients/'+user).then(res =>{
                if(res.data && res.data.available_ingredients) {
                    setUserIngredients(res.data.available_ingredients);
                    setSearchSettings({...searchSettings, user_id: user});
                }
            }).catch((err) => {
                if(err.response.status === 400){
                    setUser(null);
                } else {
                    console.log(err)
                }
            });
        }
    }

    const onIngredientClick = (ingredient, onHand) => {
        if(editUserIngr) {
            axios.post('/api/user_ingredients', {user_id: user, ingr_uuid: ingredient.uuid, delete: onHand}).then(res =>{
                console.log(res)
                if(res.data && res.data.available_ingredients){
                    setUserIngredients(res.data.available_ingredients);
                }
            });
        } else {
            setIngrFilter([ingredient.uuid, ingredient.name])
            navigate('/');
        }
    };

    function checkEnter(e) {
        if(e.code === "Enter" || e.code === "NumpadEnter") get_user_ingredients();
    }

    function search_user_drinks(){
        if(searchSettings.user_id){
            setUserDrinksReq(searchSettings);
            navigate('/');
        }
    }

    return (
        <div>
            <p>{"User ID:"+(userIngredients === null ? '':' '+user)}</p>
            {userIngredients !== null && <div>
                <FaEdit className="sorted-filter-icon" style={{backgroundColor: editUserIngr? "3B3D3F":"", cursor:'pointer'}} onClick={()=>{setEditUserIngr(!editUserIngr)}}/>
                <div>
                    <span>Allowed Missing Ingredients:  </span>
                    <select onChange={(e)=> setSearchSettings({...searchSettings, tol: e.target.value})}>
                        {[0,1,2,3,4,5].map(index=> {
                            return <option value={index} selected={searchSettings.tol === index}>{index}</option>;
                        })}
                    </select>
                </div>
                <div>
                    <span>Exact Search:  </span>
                    <input type='checkbox' checked={searchSettings.strict} onChange={(e)=> setSearchSettings({...searchSettings, strict: e.target.checked})}></input>
                </div>
                <FaSearch style={{cursor:'pointer', marginTop:'15px'}} onClick={search_user_drinks}/>
            </div>}
            {userIngredients === null && <div>
                <input content='text' placeholder='00000' value={user||''} onChange={(e)=> setUser(parseInt(e.target.value.substring(0,5)) || null)} onKeyDownCapture={(e)=>{checkEnter(e)}}></input>
                <FaCheck style={{marginLeft: '10px', cursor:'pointer'}} onClick={get_user_ingredients} />
            </div>}

            <div style={{display: "flex", justifyContent: "center", alignItems:"center", marginLeft:"-53px"}}>
                <FaSortAmountDown className="sorted-filter-icon" style={{backgroundColor: sorted? "3B3D3F":""}} onClick={()=>{setSorted(!sorted)}}/>
                <h1 className="all-ingredients-title">All Ingredients</h1>
            </div>
            {(sorted ? sortedIngredients:ingredients).map((ingredient) =>{
                return <div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {ingredient.count > 0 && <IngredientListEntry ingredient={ingredient} onIngredientClick={onIngredientClick} userOnHand={userIngredients !== null && userIngredients.includes(ingredient.uuid)} />}
                    </div>
                </div>;
            })}
        </div>
    )
}

export default ViewIngredients;