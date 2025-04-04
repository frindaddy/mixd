import DrinkEntry from "./DrinkEntry";
import {useEffect, useState} from "react";

const DrinkArray = ({ drinkList, adminKey, getDrinkList, setShowLoader, menuSettings, editMenu, showMenuDesc, filterText}) => {

    const [filteredDrinkList, setFilteredDrinkList] = useState([]);

    useEffect(()=>{
        if(filterText) {
            setFilteredDrinkList(drinkList.filter((drink => {
                return drink.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
            })));
        }
    }, [filterText, drinkList])

    return (
        <>
            {(filterText ? filteredDrinkList : drinkList).map((drink) => {
                return <DrinkEntry drink={drink} getDrinkList={getDrinkList} adminKey={adminKey} setShowLoader={setShowLoader} menuSettings={menuSettings} editMenu={editMenu} showMenuDesc={showMenuDesc}/>
            })}
            {(filterText ? filteredDrinkList : drinkList).length === 0 && <p className="filter-match-title">No Drinks Match Your Search</p>}
        </>
    )
}

export default DrinkArray;