import React, {useEffect, useState} from "react"
import axios from "axios";
import "../../format/FilterPanel.css";
import IngredientCategories from "../../definitions/IngredientCategories";

const IngredientsFilterPanel = ({searchIngredient, setSearchIngredient}) => {

    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        axios.get('/api/count_ingredients')
            .then((res) => {
                if (res.data) {
                    setIngredients(res.data.filter(ingr => ingr.count > 0));
                }
            }).catch((err) => console.log(err));
    }, []);

    function onIngrClick(ingr_uuid){
        if(searchIngredient === ingr_uuid){
            setSearchIngredient('');
        } else {
            setSearchIngredient(ingr_uuid);
        }
    }

    return (
        <div className="filter-panel-container">
            {IngredientCategories.map((cat)=>{
                return <div className="filter-category-container">
                    <p className="filter-category-title">{cat.header}</p>
                    <div className="filter-category-tag-container">
                        {ingredients.filter(ingr=>ingr.category === cat.name).map((ingr)=>{
                            let selected = searchIngredient === ingr.uuid;
                            return (
                                <div className="tag-container">
                                    <div onClick={()=>{onIngrClick(ingr.uuid)}}
                                        className={'tag clickable unselectable ' + (selected ? '':'unselected-tag-filter')}
                                        style={selected ? {backgroundColor: 'green'}: {}}>{ingr.name}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            })}
        </div>
    )
}

export default IngredientsFilterPanel;