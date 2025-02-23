import React, {useEffect, useState} from "react"
import DrinkTags, {filterTags} from "../DrinkTags";
import {FaTrash, FaWrench, FaStar, FaRegStar} from "react-icons/fa";
import axios from "axios";
import "../../format/DrinkList.css";
import {Link} from "react-router-dom";

const DrinkEntry = ({drink, setCurrentPage, setCurrentDrink, getDrinkList, adminKey, filteredTags}) => {

    const defaultTagCategories = ['spirit', 'style', 'taste'];
    const [tagCategories, setTagCategories] = useState(defaultTagCategories);
    const [starColor, setStarColor] = useState(undefined);
    const [clientSideFeature, setClientSideFeature] = useState(false);

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
                let num_featured = top_picks.filter((tag) => tag.value === 'Featured').length;
                if(num_featured > 0) {
                    setClientSideFeature(true);
                }
                if(top_picks.length - num_featured === 0){
                    setStarColor('white');
                } else {
                    setStarColor('gold');
                }
            } else {
                setStarColor(undefined)
            }
        }
    }, [filteredTags, drink]);

    const setUpdateDrinkPage = () => {
        setCurrentPage("updateDrink");
        setCurrentDrink(drink.uuid);
    };

    const confirmDeleteDrink = () => {
        if(window.confirm('Are you sure you want to delete \''+drink.name+'\'?') === true){
            axios.delete('api/drink/'+drink.uuid, {headers:{Authorization: `Bearer ${adminKey}`}})
                .then((res) => {
                    if (res.data) {
                        getDrinkList();
                    } else {
                        alert('FAILED TO REMOVE DRINK!');
                    }
                }).catch((err) => console.log(err));
        } else {
            alert('Drink not deleted.');
        }
    }

    async function setDrinkFeatured(newFeaturedStatus) {
        setClientSideFeature(newFeaturedStatus);
        setStarColor(undefined);
        const response = await axios.post('./api/modify_tag/', {drinkUUID: drink.uuid, tag: {value: 'Featured', category: 'top_pick'}, change: newFeaturedStatus ? 'add':'remove'}, {
                headers: {
                    Authorization: `Bearer ${adminKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        if (response.status === 200) {
            getDrinkList();
        } else {
            console.error('Error setting drink tag: status '+response.status);
        }
    }

    return (
        <>
        <hr class="list-separator"></hr>
        <div class="list-entry">
            <div style={{display: "flex"}}>
                <Link to={'drink/'+drink.uuid} class="glass-container" style={{cursor: "pointer"}}>
                    {drink.glass && <img src={'./api/image?file=glassware/'+drink.glass.toLowerCase()+'.svg&backup=glassware/unknown.svg'} alt={drink.glass+' glass'}/>}
                    {!drink.glass && <img src={'./api/image?file=glassware/unknown.svg'} alt={'No glass listed'}/>}
                </Link>
            </div>

            <div className="list-column">
                {adminKey && <div className="remove-drink">
                    {!clientSideFeature && <FaRegStar onClick={()=>{setDrinkFeatured(true)}} style={{cursor: "pointer", paddingRight:'8px'}}/>}
                    {clientSideFeature && <FaStar onClick={()=>{setDrinkFeatured(false)}} style={{cursor: "pointer", paddingRight:'8px'}}/>}
                    <FaWrench onClick={()=>{setUpdateDrinkPage()}} style={{cursor: "pointer", paddingRight:'8px'}}/>
                    <FaTrash onClick={()=>{confirmDeleteDrink()}} style={{cursor: "pointer"}}/>
                </div>}
                {starColor && !adminKey && <div className="remove-drink">
                    <FaStar style={{color: starColor}}/>
                </div>}
                <div>
                    <Link to={'drink/'+drink.uuid} className="list-title" style={{cursor: "pointer"}}>{drink.name}</Link>
                    {drink.tags && <DrinkTags tags={filterTags(drink.tags, tagCategories)}/>}
                </div>
            </div>
        </div>
        </>
    )
}

export default DrinkEntry;