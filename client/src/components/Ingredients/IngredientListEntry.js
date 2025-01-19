import "../../format/Ingredients.css";

const IngredientListEntry = ({ingredient, setCurrentPage, setIngrFilter}) => {

    const setIngredientFilter = () => {
        setCurrentPage("drinkList");
        setIngrFilter([ingredient.uuid, ingredient.name])
    };

    return (
        <>
            <p className="ingredient-entry-title" onClick={()=>{setIngredientFilter()}} style={{cursor: "pointer"}}>{ingredient.name}</p>
            <p style={{marginLeft:'10px'}}>({ingredient.count})</p>
        </>
    )
}

export default IngredientListEntry;