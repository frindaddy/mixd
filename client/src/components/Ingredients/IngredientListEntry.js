import "../../format/ViewIngredients.css";
import {useNavigate} from "react-router-dom";

const IngredientListEntry = ({ingredient, setIngrFilter}) => {

    const navigate = useNavigate();
    const setIngredientFilter = () => {
        setIngrFilter([ingredient.uuid, ingredient.name])
        navigate('/')
    };

    return (
        <>
            <p className="ingredient-entry" onClick={()=>{setIngredientFilter()}} style={{cursor: "pointer"}}>{ingredient.name}</p>
            <p className="ingredient-use-count">({ingredient.count})</p>
        </>
    )
}

export default IngredientListEntry;