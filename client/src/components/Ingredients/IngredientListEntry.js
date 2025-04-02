import "../../format/IngredientListEntry.css";

const IngredientListEntry = ({ingredient, onIngredientClick}) => {

    return (
        <>
            <p className="ingredient-entry" onClick={()=>{onIngredientClick(ingredient)}} style={{cursor: "pointer"}}>{ingredient.name}</p>
            <p className="ingredient-use-count">({ingredient.count} uses)</p>
        </>
    )
}

export default IngredientListEntry;