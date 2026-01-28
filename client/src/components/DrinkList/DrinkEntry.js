import DrinkTags, {filterTags} from "../DrinkTags";
import {FaArrowDown, FaArrowUp, FaPlus, FaTrash, FaWrench} from "react-icons/fa";
import axios from "axios";
import "../../format/DrinkEntry.css";
import {Link, useNavigate} from "react-router-dom";

const DrinkEntry = ({user, drink, getDrinkList, adminKey, setShowLoader, menuSettings, editMenu, isMenu: isMenu}) => {

    const tagCategories = ['spirit', 'style', 'taste'];

    const navigate = useNavigate();

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
        axios.post('/api/modify_menu', {menu_id:menuSettings.menu_id, drinks: newDrinkOrder}, {headers:{Authorization: `Bearer ${user.token}`}}).then((res)=>{
            if(res.status && res.status === 200){
                menuSettings.setMenuOrder(newDrinkOrder);
            }
        });
    }

    function addMenuDrink(menu_id) {
       if(menu_id){
           axios.post('/api/add_menu_drink', {menu_id:menu_id, drink: drink.uuid}, {headers:{Authorization: `Bearer ${user.token}`}}).then((res)=>{
               if(res.status && res.status === 200){
                   navigate(-1, {replace: true});
               }
           });
       }
    }

    return (
        <>
        <hr className="list-separator"></hr>
        <div className={"drink-entry" + (menuSettings && menuSettings.editMode ? " menu-button-space":"")}>
            <Link to={'/'+drink.url_name} style={{display:"flex", width:"100%"}} onClick={()=>{setShowLoader(true)}}>
                <div className="glass-container clickable">
                    {drink.glass && <img src={'/api/image?file=glassware/'+drink.glass.toLowerCase()+'.svg&backup=glassware/unknown.svg'} alt={drink.glass+' glass'} className={isMenu ? "menu-glass":"drinklist-glass"}/>}
                    {!drink.glass && <img src={'/api/image?file=glassware/unknown.svg'} alt={'No glass listed'} className={isMenu ? "drinklist-glass":"menu-glass"}/>}
                </div>
                <div className={"drink-entry-info"+(((user && user.isAdmin)||(menuSettings && menuSettings.editMode)||editMenu) ? " drink-entry-control-space":"")}>
                    <div className="drink-entry-title clickable">{drink.name}</div>
                    {drink.tags && <DrinkTags tags={filterTags(drink.tags, tagCategories)}/>}
                    {isMenu && drink.menu_desc && <div className="menu-description">{drink.menu_desc}</div>}
                </div>
            </Link>
            {user && user.isAdmin && !menuSettings && !editMenu && <div className="drink-button-panel">
                <Link to={'/update_drink/'+drink.uuid}><FaWrench className="drink-button" style={{cursor: "pointer"}}/></Link>
                <FaTrash className="drink-button" onClick={()=>{confirmDeleteDrink()}} style={{cursor: "pointer", paddingTop:'10px'}}/>
            </div>}
            {menuSettings && menuSettings.editMode && <div className="drink-button-panel">
                <FaArrowUp className="drink-button" onClick={()=>{modifyMenu(false, true, false)}} style={{cursor: "pointer"}}/>
                <FaArrowDown className="drink-button" onClick={()=>{modifyMenu(false, false, true)}} style={{cursor: "pointer", paddingTop:'10px'}}/>
                <FaTrash className="drink-button" onClick={()=>{modifyMenu(true, false, false)}} style={{cursor: "pointer", paddingTop:'10px'}}/>
            </div>}
            {editMenu && <div className="drink-button-panel">
                <FaPlus className="drink-button" style={{cursor: "pointer"}} onClick={()=>{addMenuDrink(editMenu)}} />
            </div>}
        </div>
        </>
    )
}

export default DrinkEntry;