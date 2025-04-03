import "../../format/IngredientListEntry.css";

const IngredientListEntry = ({ingredient, onIngredientClick}) => {

    return (
        <div className="ingredient-list-entry-container" onClick={()=>{onIngredientClick(ingredient)}}>
            <span className="ingredient-entry">{ingredient.name}</span>
            <span className="ingredient-use-count">({ingredient.count} {ingredient.count > 1 ? "uses":"use"})</span>
        </div>
    )
}

export default IngredientListEntry;