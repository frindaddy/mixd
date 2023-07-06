import React, {useEffect, useState} from "react"
import DrinkEntry from "./DrinkEntry";

const DrinkArray = ({ filter, drinkList, adminKey, setCurrentPage, setCurrentDrink, getDrinkList }) => {

    const [filteredList, setFilteredList] = useState(drinkList);

    useEffect(() => {
        setFilteredList(drinkList.filter((drink) => {
            return drink.name.toLowerCase().includes(filter.text.toLowerCase())
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