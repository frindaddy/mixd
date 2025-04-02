import "../../format/IngredientListEntry.css";

const IngredientListEntry = ({ingredient, onIngredientClick}) => {

    return (
        <>
            <span className="ingredient-entry" onClick={()=>{onIngredientClick(ingredient)}} style={{cursor: "pointer"}}>{ingredient.name}</span>
            <span className="ingredient-use-count">({ingredient.count} {ingredient.count > 1 ? "uses":"use"})</span>
        </>
    )
}

export default IngredientListEntry;