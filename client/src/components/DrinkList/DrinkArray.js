import React, {useEffect, useState} from "react"
import DrinkEntry from "./DrinkEntry";

const DrinkArray = ({ filter, drinkList, adminKey, setCurrentPage, setCurrentDrink, getDrinkList }) => {

    const [filteredList, setFilteredList] = useState(drinkList);

    function countTags(drink, tags) {
        console.log(drink, tags);
        if(drink.tags && drink.tags.length > 0 && tags) {
            return drink.tags.filter((drinkTag) => {
                return tags.filter((filterTag) => {
                    return filterTag.category === drinkTag.category && filterTag.value.toLowerCase() === drinkTag.value.toLowerCase();
                }).length > 0;
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
                inFilteredGlass = filter.glasses.includes(drinkList[i].glass);
            }
            drinkList[i] = {
                ...drinkList[i],
                passesFilter: ((filter.tags && tagCount > 0) || !filter.tags) && ((filter.glasses && inFilteredGlass) || !filter.glasses),
                tagCount: tagCount,
                inFilteredGlass: inFilteredGlass
            };
        }

        setFilteredList(drinkList.filter((drink) => {
            return drink.name.toLowerCase().includes(filter.text.toLowerCase()) && drink.passesFilter;
        }))
    }, [drinkList, filter]);

    return (
        <div>
            {filteredList.map((drink) => {
                return <DrinkEntry drink={drink} setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink} getDrinkList={getDrinkList} adminKey={adminKey}/>
            })}
        </div>
    )
}

export default DrinkArray;