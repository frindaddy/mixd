import React from "react"
import coupe from "../../images/coupe.png";
import DrinkTags from "../tags";
const DrinkEntry = ({drink, setCurrentPage, setCurrentDrink}) => {

    const setDrinkPage = () => {
        setCurrentPage("drinkInfo");
        setCurrentDrink(drink._id);
    };

    return (
        <div class="drink" onClick={()=>{setDrinkPage()}} style={{cursor: "pointer"}}>
            <div class="column">
                <img src={coupe} alt="Vector image of a coupe glass" />
            </div>
            <div class="column">
                <p class="title">{drink.name}</p>
                {drink.tags && <DrinkTags tags={drink.tags}/>}
            </div>
        </div>
    )
}

export default DrinkEntry;