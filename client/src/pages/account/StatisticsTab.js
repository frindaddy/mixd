import React, {useEffect, useState} from "react"
import {FaSortAmountDown} from "react-icons/fa";
import axios from "axios";
import IngredientListEntry from "../../components/Ingredients/IngredientListEntry";
import "../../format/MyBarTab.css";
import {useNavigate} from "react-router-dom";

const StatisticsTab = ({setIngrFilter}) => {
    const [ingredients, setIngredients] = useState([]);
    const [sortedIngredients, setSortedIngredients] = useState([]);
    const [sorted, setSorted] = useState(false);
    const [sortSetting, setSortSetting] = useState(0)

    const navigate = useNavigate();

    useEffect(() => {
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

    const onIngredientClick = (ingredient, onHand) => {
        setIngrFilter([ingredient.uuid, ingredient.name])
        navigate('/');
    };

    return (
        <>
            <div>
                <div style={{display: "flex", justifyContent: "center", alignItems:"center", marginRight:"53px"}}>
                    <FaSortAmountDown className="sorted-filter-icon" style={{backgroundColor: sorted? "3B3D3F":""}} onClick={()=>{setSorted(!sorted)}}/>
                    <h1 className="ingredient-title">Ingredients</h1>
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
                            {ingredient.count > 0 && <IngredientListEntry ingredient={ingredient} onIngredientClick={onIngredientClick} />}
                        </div>
                    </div>;
                })}
            </div>
        </>
    )
}

export default StatisticsTab;