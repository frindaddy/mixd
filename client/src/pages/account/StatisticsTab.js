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
        <>
            <h1 className="tab-title">Statistics</h1>
            <h2 className="tab-subtitle">Ingredient Usage</h2>
            <p className="ingredient-sort-instructions">Click on an ingredient to show all drinks using that ingredient!</p>
            <div className="ingredient-usage-container">
                {IngredientCategories.map(category => {
                    let category_ingr = ingredients.filter(ingr => ingr.category === category.name);
                    if(category_ingr.length === 0) return <></>
                    return <div className="ingredient-category-container">
                        <h3 className="ingredient-category-title">{category.header}</h3>
                        {category_ingr.map((ingredient) =>{
                            return <div className="ingredient-list-entry-container">
                                {ingredient.count > 0 && <IngredientListEntry ingredient={ingredient} onIngredientClick={onIngredientClick} />}
                            </div>;
                        })}
                    </div>
                })}
            </div>
        </>
    )
}

export default StatisticsTab;