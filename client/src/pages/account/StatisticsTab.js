import React, {useEffect, useState} from "react"
import {FaSortAmountDown} from "react-icons/fa";
import axios from "axios";
import IngredientListEntry from "../../components/Ingredients/IngredientListEntry";
import "../../format/MyBarTab.css";
import {useNavigate} from "react-router-dom";

const StatisticsTab = ({}) => {
    const [ingredients, setIngredients] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = () => {
        axios.get('/api/count_ingredients')
            .then((res) => {
                if (res.data) {
                    setIngredients(res.data);
                }
            }).catch((err) => console.log(err));
    }

    const onIngredientClick = (ingredient) => {
        console.log(ingredient);
        navigate('/');
    };

    return (
        <>
            <div>
                <div style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
                    <h1 className="ingredient-title">Ingredients</h1>
                </div>
                {ingredients.map((ingredient) =>{
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