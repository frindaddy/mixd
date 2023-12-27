import React, {useEffect, useState} from "react"
import DrinkTags, {filterTags} from "../DrinkTags";
import {FaTrash, FaWrench, FaStar} from "react-icons/fa";
import axios from "axios";

const DrinkEntry = ({drink, setCurrentPage, setCurrentDrink, getDrinkList, adminKey, filteredTags}) => {

    const defaultTagCategories = ['spirit', 'style', 'taste'];
    const [tagCategories, setTagCategories] = useState(defaultTagCategories);
    const [starColor, setStarColor] = useState(undefined);

    useEffect(() => {
        if(filteredTags) {
            let newCategories = defaultTagCategories;
            filteredTags.forEach((tag)=>{
                let cat = tag.split('>')[0];
                if (!defaultTagCategories.includes(cat) && !newCategories.includes(cat)) {
                    newCategories = [...newCategories, cat];
                }
            });
            setTagCategories(newCategories);
        }
        if(drink.tags){
            let top_picks = drink.tags.filter((tag) => tag.category === 'top_pick');
            if (top_picks.length > 0) {
                let num_unfeatured = top_picks.filter((tag) => tag.value !== 'Featured').length;
                if(num_unfeatured === 0){
                    setStarColor('white');
                } else {
                    setStarColor('gold');
                }
            }
        }
    }, [filteredTags]);

    const setDrinkPage = () => {
        setCurrentPage("drinkInfo");
        setCurrentDrink(drink.uuid);
    };

    const setUpdateDrinkPage = () => {
        setCurrentPage("updateDrink");
        setCurrentDrink(drink.uuid);
    };

    const confirmDeleteDrink = () => {
        if(window.confirm('Are you sure you want to delete \''+drink.name+'\'?') === true){
            removeDrink();
        } else {
            alert('Drink not deleted.');
        }
    }

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
        <>
        <hr class="drink-list-separator"></hr>
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
                    <FaTrash onClick={()=>{confirmDeleteDrink()}} style={{cursor: "pointer"}}/>
                </div>}
                {starColor && !adminKey && <div className="remove-drink">
                    <FaStar style={{color: starColor}}/>
                </div>}
                <div>
                    <a href={"#drink"}><p className="entry-title" onClick={()=>{setDrinkPage()}} style={{cursor: "pointer"}}>{drink.name}</p></a>
                    {drink.tags && <DrinkTags tags={filterTags(drink.tags, tagCategories)}/>}
                </div>
            </div>
        </div>
        </>
    )
}

export default DrinkEntry;