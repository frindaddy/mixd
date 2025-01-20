import "../../format/ViewIngredients.css";

const IngredientListEntry = ({ingredient, setCurrentPage, setIngrFilter}) => {

    const setIngredientFilter = () => {
        setCurrentPage("drinkList");
        setIngrFilter([ingredient.uuid, ingredient.name])
    };

    return (
        <>
            <p className="ingredient-entry" onClick={()=>{setIngredientFilter()}} style={{cursor: "pointer"}}>{ingredient.name}</p>
            <p className="ingredient-use-count">({ingredient.count})</p>
        </>
    )
}

export default IngredientListEntry;