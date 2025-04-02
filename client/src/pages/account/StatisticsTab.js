import React, {useEffect, useState} from "react"
import axios from "axios";
import IngredientListEntry from "../../components/Ingredients/IngredientListEntry";
import "../../format/StatisticsTab.css";
import {useNavigate} from "react-router-dom";
import IngredientCategories from "../../definitions/IngredientCategories";

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
        <div>
            <div style={{display: "flex", justifyContent: "center", alignItems:"center"}}>
                <h1 className="ingredient-title">Ingredient Usage</h1>
            </div>
            {IngredientCategories.map(category => {
                let category_ingr = ingredients.filter(ingr => ingr.category === category.name);
                if(category_ingr.length === 0) return <></>
                return <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
                    <h3 style={{display: "flex", justifyContent: "center", marginBottom: '2px'}}>{category.header}</h3>
                    {category_ingr.map((ingredient) =>{
                        return <div>
                            <div style={{display: "flex", justifyContent: "center"}}>
                                {ingredient.count > 0 && <IngredientListEntry ingredient={ingredient} onIngredientClick={onIngredientClick} />}
                            </div>
                        </div>;
                    })}
                </div>
            })}
        </div>
    )
}

export default StatisticsTab;