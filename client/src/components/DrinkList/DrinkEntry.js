import React from "react"
import coupe from "../../images/coupe.png";
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
                <div class="flex-container">
                    <div class="tag gin">Gin</div>
                    <div class="tag aperol">Aperol</div>
                    <div class="tag light">Light</div>
                    <div class="tag citrus">Citrus</div>
                </div>
            </div>
        </div>
    )
}

export default DrinkEntry;