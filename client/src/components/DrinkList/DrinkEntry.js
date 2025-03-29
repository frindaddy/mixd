import React, {useEffect, useState} from "react"
import DrinkTags, {filterTags} from "../DrinkTags";
import {FaArrowDown, FaArrowUp, FaTrash, FaWrench} from "react-icons/fa";
import axios from "axios";
import "../../format/DrinkList.css";
import {Link} from "react-router-dom";

const DrinkEntry = ({drink, getDrinkList, adminKey, filteredTags, setShowLoader, menuSettings}) => {

    const defaultTagCategories = ['spirit', 'style', 'taste'];
    const [tagCategories, setTagCategories] = useState(defaultTagCategories);

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
    }, [filteredTags]);

    const confirmDeleteDrink = () => {
        if(window.confirm('Are you sure you want to delete \''+drink.name+'\'?') === true){
            axios.delete('/api/drink/'+drink.uuid, {headers:{Authorization: `Bearer ${adminKey}`}})
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

    function modifyMenu() {
        let newDrinkOrder = [...menuSettings.menuOrder];
        axios.post('/api/modify_menu', {menu_id:menuSettings.menu_id, drinks: newDrinkOrder}).then((res)=>{
            menuSettings.setMenuOrder(newDrinkOrder);
        });
    }

    return (
        <>
        <hr className="list-separator"></hr>
        <div className="list-entry">
            <div style={{display: "flex"}}>
                <Link to={'/'+drink.url_name} class="glass-container" style={{cursor: "pointer"}} onClick={()=>{ setShowLoader(true)}}>
                    {drink.glass && <img src={'/api/image?file=glassware/'+drink.glass.toLowerCase()+'.svg&backup=glassware/unknown.svg'} alt={drink.glass+' glass'}/>}
                    {!drink.glass && <img src={'/api/image?file=glassware/unknown.svg'} alt={'No glass listed'}/>}
                </Link>
            </div>

            <div className="list-column">
                {adminKey && !menuSettings && <div className="remove-drink">
                    <Link to={'/update_drink/'+drink.uuid}><FaWrench style={{cursor: "pointer", paddingRight:'8px'}}/></Link>
                    <FaTrash onClick={()=>{confirmDeleteDrink()}} style={{cursor: "pointer"}}/>
                </div>}
                {menuSettings && menuSettings.editMode && <div className="remove-drink">
                    <FaArrowUp style={{cursor: "pointer", paddingRight:'8px'}}/>
                    <FaArrowDown style={{cursor: "pointer", paddingRight:'8px'}}/>
                    <FaTrash onClick={()=>{modifyMenu()}} style={{cursor: "pointer"}}/>
                </div>}
                <div>
                    <Link to={'/'+drink.url_name} className="list-title" style={{cursor: "pointer"}} onClick={()=>{ setShowLoader(true)}}>{drink.name}</Link>
                    {drink.tags && <DrinkTags tags={filterTags(drink.tags, tagCategories)}/>}
                </div>
            </div>
        </div>
        </>
    )
}

export default DrinkEntry;