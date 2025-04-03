import DrinkEntry from "./DrinkEntry";

const DrinkArray = ({ drinkList, adminKey, getDrinkList, setShowLoader, menuSettings, editMenu, showMenuDesc}) => {

    return (
        <>
            {drinkList.map((drink) => {
                return <DrinkEntry drink={drink} getDrinkList={getDrinkList} adminKey={adminKey} setShowLoader={setShowLoader} menuSettings={menuSettings} editMenu={editMenu} showMenuDesc={showMenuDesc}/>
            })}
            {drinkList.length === 0 && <p className="filter-match-title">No Drinks Match Your Search</p>}
        </>
    )
}

export default DrinkArray;