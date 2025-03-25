import React, {useEffect, useState} from "react"
import {FaCheck, FaEdit, FaSortAmountDown} from "react-icons/fa";
import axios from "axios";
import IngredientListEntry from "../components/Ingredients/IngredientListEntry";
import "../format/ViewIngredients.css";
import {useNavigate} from "react-router-dom";

const ViewIngredients = ({setIngrFilter}) => {
    const [ingredients, setIngredients] = useState([]);
    const [sortedIngredients, setSortedIngredients] = useState([]);
    const [sorted, setSorted] = useState(false);
    const [user, setUser] = useState(null);
    const [userIngredients, setUserIngredients] = useState(null);
    const [editUserIngr, setEditUserIngr] = useState(false);

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
        axios.get('/api/user_ingredients/'+user).then(res =>{
            if(res.data) {
                setUserIngredients(res.data.available_ingredients)
                console.log(res.data.available_ingredients)
            }
        }).catch((err) => console.log(err));
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
            navigate('/')
        }
    };

    function checkEnter(e) {
        if(e.code === "Enter") get_user_ingredients();
    }

    return (
        <div>
            <p>{"User ID:"+(userIngredients === null ? '':' '+user)}</p>
            {userIngredients !== null && <FaEdit className="sorted-filter-icon" style={{backgroundColor: editUserIngr? "3B3D3F":"", cursor:'pointer'}} onClick={()=>{setEditUserIngr(!editUserIngr)}}/>}
            {userIngredients === null && <div>
                <input content='text' placeholder='00000' value={user} onChange={(e)=> setUser(parseInt(e.target.value.substring(0,5)) || null)} onKeyDownCapture={(e)=>{checkEnter(e)}}></input>
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