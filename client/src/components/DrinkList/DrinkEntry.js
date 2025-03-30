import React, {useEffect, useState} from "react"
import DrinkTags, {filterTags} from "../DrinkTags";
import {FaArrowDown, FaArrowUp, FaPlus, FaTrash, FaWrench} from "react-icons/fa";
import axios from "axios";
import "../../format/DrinkList.css";
import {Link, useNavigate} from "react-router-dom";

const DrinkEntry = ({drink, getDrinkList, adminKey, filteredTags, setShowLoader, menuSettings, editMenu, showMenuDesc}) => {

    const defaultTagCategories = ['spirit', 'style', 'taste'];
    const [tagCategories, setTagCategories] = useState(defaultTagCategories);

    const navigate = useNavigate();

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

    function modifyMenu(deleteDrink, moveUp, moveDown) {
        let newDrinkOrder = [...menuSettings.menuOrder].filter((drinkUUID => !(deleteDrink && drinkUUID === drink.uuid)));
        if(!deleteDrink){
            let drinkIndex = newDrinkOrder.indexOf(drink.uuid);
            if(moveUp){
                if(drinkIndex === 0){
                    let temp_uuid = newDrinkOrder[0]
                    newDrinkOrder = newDrinkOrder.slice(1);
                    newDrinkOrder.push(temp_uuid);
                } else {
                    let temp_uuid = newDrinkOrder[drinkIndex - 1]
                    newDrinkOrder[drinkIndex - 1] = newDrinkOrder[drinkIndex];
                    newDrinkOrder[drinkIndex] = temp_uuid;
                }
            } else if(moveDown) {
                if(drinkIndex === newDrinkOrder.length - 1){
                    let temp_uuid = newDrinkOrder[newDrinkOrder.length - 1]
                    newDrinkOrder.pop();
                    newDrinkOrder = [temp_uuid, ...newDrinkOrder];
                } else {
                    let temp_uuid = newDrinkOrder[drinkIndex + 1]
                    newDrinkOrder[drinkIndex + 1] = newDrinkOrder[drinkIndex];
                    newDrinkOrder[drinkIndex] = temp_uuid;
                }
            }
        }
        axios.post('/api/modify_menu', {menu_id:menuSettings.menu_id, drinks: newDrinkOrder}).then((res)=>{
            if(res.status && res.status === 200){
                menuSettings.setMenuOrder(newDrinkOrder);
            }
        });
    }

    function addMenuDrink(menu_id) {
       if(menu_id){
           axios.post('/api/add_menu_drink', {menu_id:menu_id, drink: drink.uuid}).then((res)=>{
               if(res.status && res.status === 200){
                   navigate('/menu/'+menu_id+'#edit', {replace: true});
               }
           });
       }
    }

    return (
        <>
        <hr className="list-separator"></hr>
        <div className="list-entry">
            <div style={{display: "flex"}}>
                <Link to={'/'+drink.url_name} class="glass-container clickable" onClick={()=>{ setShowLoader(true)}}>
                    {drink.glass && <img src={'/api/image?file=glassware/'+drink.glass.toLowerCase()+'.svg&backup=glassware/unknown.svg'} alt={drink.glass+' glass'}/>}
                    {!drink.glass && <img src={'/api/image?file=glassware/unknown.svg'} alt={'No glass listed'}/>}
                </Link>
            </div>

            <div className="list-column">
                {adminKey && !menuSettings && !editMenu && <div className="drink-button">
                    <Link to={'/update_drink/'+drink.uuid}><FaWrench style={{cursor: "pointer", paddingRight:'8px'}}/></Link>
                    <FaTrash onClick={()=>{confirmDeleteDrink()}} style={{cursor: "pointer"}}/>
                </div>}
                {menuSettings && menuSettings.editMode && <div className="drink-button">
                    <FaArrowUp onClick={()=>{modifyMenu(false, true, false)}} style={{cursor: "pointer", paddingRight:'8px'}}/>
                    <FaArrowDown onClick={()=>{modifyMenu(false, false, true)}} style={{cursor: "pointer", paddingRight:'8px'}}/>
                    <FaTrash onClick={()=>{modifyMenu(true, false, false)}} style={{cursor: "pointer"}}/>
                </div>}
                {editMenu && <div className="drink-button">
                    <FaPlus style={{cursor: "pointer"}} onClick={()=>{addMenuDrink(editMenu)}} />
                </div>}
                <div>
                    <Link to={'/'+drink.url_name} className="list-title clickable" onClick={()=>{ setShowLoader(true)}}>{drink.name}</Link>
                    {drink.tags && <DrinkTags tags={filterTags(drink.tags, tagCategories)}/>}
                    {showMenuDesc && drink.menu_desc && <div className="menu-description">
                        {drink.menu_desc}
                    </div>}
                </div>
            </div>
        </div>
        </>
    )
}

export default DrinkEntry;