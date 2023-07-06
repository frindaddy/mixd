import React from "react"
import DrinkEntry from "./DrinkEntry";

const DrinkArray = ({ filter, drinkList, adminKey, setCurrentPage, setCurrentDrink, getDrinkList }) => {

    return (
        <div>
            {drinkList.map((drink) => {
                if (drink.name.toLowerCase().includes(filter.text.toLowerCase())){
                    return <DrinkEntry drink={drink} setCurrentPage={setCurrentPage} setCurrentDrink={setCurrentDrink} getDrinkList={getDrinkList} adminKey={adminKey}/>
                }
            })}
        </div>
    )
}

export default DrinkArray;