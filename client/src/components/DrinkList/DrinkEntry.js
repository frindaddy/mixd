import React from "react"
import DrinkTags, {filterTags} from "../DrinkTags";
const DrinkEntry = ({drink, setCurrentPage, setCurrentDrink}) => {

    const setDrinkPage = () => {
        setCurrentPage("drinkInfo");
        setCurrentDrink(drink._id);
    };

    return (
        <div class="drink" onClick={()=>{setDrinkPage()}} style={{cursor: "pointer"}}>
            <div class="column">
                {drink.glass && <img src={'./api/image?file=glassware/'+drink.glass.toLowerCase()+'.svg&backup=glassware/unknown.svg'} alt={drink.glass+' glass'}/>}
                {!drink.glass && <img src={'./api/image?file=glassware/unknown.svg'} alt={'No glass listed'}/>}
            </div>
            <div class="column">
                <p class="list-title">{drink.name}</p>
                {drink.tags && <DrinkTags tags={filterTags(drink.tags, ['spirit', 'style', 'taste'])}/>}
            </div>
        </div>
    )
}

export default DrinkEntry;