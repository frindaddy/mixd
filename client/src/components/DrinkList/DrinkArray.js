import React, {useEffect, useState} from "react"
import DrinkEntry from "./DrinkEntry";

const DrinkArray = ({ filter, drinkList, adminKey, setCurrentPage, setCurrentDrink, getDrinkList }) => {

    const [filteredList, setFilteredList] = useState(drinkList);

    function countTags(drink, tags) {
        if(drink.tags && drink.tags.length > 0 && tags) {
            return drink.tags.filter((drinkTag) => {
                return tags.includes(drinkTag.category + '>' + drinkTag.value);
            }).length;
        }
        return 0;
    }

    useEffect(() => {
        for (let i = 0; i < drinkList.length; i++) {
            let tagCount = 0;
            let inFilteredGlass = false;
            if(filter.tags){
                tagCount = countTags(drinkList[i], filter.tags);
            }
            if(filter.glasses){
                if(filter.glasses.includes(drinkList[i].glass)) {
                    inFilteredGlass = true;
                    //tagCount += 1;
                }
            }
            drinkList[i] = {
                ...drinkList[i],
                passesFilter: ((filter.tags && tagCount > 0) || !filter.tags || filter.tags.length === 0) && ((filter.glasses && inFilteredGlass) || !filter.glasses || filter.glasses.length === 0),
                tagCount: tagCount,
                inFilteredGlass: inFilteredGlass
            };
        }
        let unsortedList = drinkList.filter((drink) => {
            return drink.name.toLowerCase().includes(filter.text.toLowerCase()) && drink.passesFilter;
        });
        let sortedList = unsortedList.sort((a, b) => b.tagCount - a.tagCount);
        setFilteredList(sortedList);
    }, [drinkList, filter]);

    return (
        <div>
            {filteredList.length > 0 && filter.tags && filteredList[filteredList.length - 1].tagCount < filter.tags.length && <p>Perfect Matches</p>}
            {filteredList.map((drink) => {
                if (!filter.tags || drink.tagCount === filter.tags.length) {
                    return <DrinkEntry drink={drink} setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink} getDrinkList={getDrinkList} adminKey={adminKey} filteredTags={filter.tags}/>
                }
            })}
            {filteredList.length > 0 && filter.tags && filteredList[0].tagCount !== filter.tags.length && <p><i>None</i></p>}
            {filteredList.length > 0 && filter.tags && filteredList[filteredList.length - 1].tagCount < filter.tags.length && <p>Close Results</p>}
            {filteredList.map((drink) => {
                if (filter.tags && drink.tagCount < filter.tags.length) {
                    return <DrinkEntry drink={drink} setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink} getDrinkList={getDrinkList} adminKey={adminKey} filteredTags={filter.tags}/>
                }
            })}
            {filteredList.length === 0 && drinkList.length > 0 && <p>No Drinks Match Your Filter</p>}
        </div>
    )
}

export default DrinkArray;