import "../../format/ViewIngredients.css";

const IngredientListEntry = ({ingredient, onIngredientClick, userOnHand}) => {

    return (
        <>
            <p className="ingredient-entry" onClick={()=>{onIngredientClick(ingredient, userOnHand)}} style={{cursor: "pointer", color: userOnHand ? 'lime':''}}>{ingredient.name}</p>
            <p className="ingredient-use-count">({ingredient.count})</p>
        </>
    )
}

export default IngredientListEntry;