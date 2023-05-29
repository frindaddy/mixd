import React from "react"
import DrinkTags, {filterTags} from "../DrinkTags";
import GlassImg from "./GlassImg";
const DrinkEntry = ({drink, setCurrentPage, setCurrentDrink}) => {

    const setDrinkPage = () => {
        setCurrentPage("drinkInfo");
        setCurrentDrink(drink._id);
    };

    return (
        <div class="drink" onClick={()=>{setDrinkPage()}} style={{cursor: "pointer"}}>
            <div class="column">
                <GlassImg glassType={drink.glass}/>
            </div>
            <div class="column">
                <p class="list-title">{drink.name}</p>
                {drink.tags && <DrinkTags tags={filterTags(drink.tags, ['spirit', 'style', 'taste'])}/>}
            </div>
        </div>
    )
}

export default DrinkEntry;