import React from "react"
import DrinkTags, {filterTags} from "../DrinkTags";
import {FaTrash, FaWrench} from "react-icons/fa";
import axios from "axios";

const DrinkEntry = ({drink, setCurrentPage, setCurrentDrink, getDrinkList, adminKey, tagCount}) => {

    const setDrinkPage = () => {
        setCurrentPage("drinkInfo");
        setCurrentDrink(drink.uuid);
    };

    const setUpdateDrinkPage = () => {
        setCurrentPage("updateDrink");
        setCurrentDrink(drink.uuid);
    };

    const removeDrink = () => {
        axios.delete('api/drink/'+drink.uuid, {headers:{Authorization: `Bearer ${adminKey}`}})
            .then((res) => {
                if (res.data) {
                    getDrinkList();
                } else {
                    alert('FAILED TO REMOVE DRINK!');
                }
            }).catch((err) => console.log(err));
    }

    return (
        <div class="drink-entry">
            <a style={{display: "flex"}} href={"#drink"}>
                <div class="glass-container" onClick={()=>{setDrinkPage()}} style={{cursor: "pointer"}}>
                    {drink.glass && <img src={'./api/image?file=glassware/'+drink.glass.toLowerCase()+'.svg&backup=glassware/unknown.svg'} alt={drink.glass+' glass'}/>}
                    {!drink.glass && <img src={'./api/image?file=glassware/unknown.svg'} alt={'No glass listed'}/>}
                </div>
            </a>

            <div className="entry-column">
                {adminKey && <div className="remove-drink">
                    <FaWrench onClick={()=>{setUpdateDrinkPage()}} style={{cursor: "pointer", paddingRight:'8px'}}/>
                    <FaTrash onClick={()=>{removeDrink()}} style={{cursor: "pointer"}}/>
                </div>}
                <div>
                    <a href={"#drink"}><p className="entry-title" onClick={()=>{setDrinkPage()}} style={{cursor: "pointer"}}>{drink.name}</p></a>
                    {drink.tags && <DrinkTags tags={filterTags(drink.tags, ['spirit', 'style', 'taste'])}/>}
                </div>
            </div>
            
        </div>
    )
}

export default DrinkEntry;