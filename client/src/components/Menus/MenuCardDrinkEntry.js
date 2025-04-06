import { getColor } from "../DrinkTags";
import "../../format/MenuCardDrinkEntry.css"

const MenuCardDrinkEntry = ({drink}) => {

    return (
        <>
            <hr></hr>
            <div style={{display:"flex"}}>
                {drink.glass && <img className="menu-card-drink-entry-glass" src={'/api/image?file=glassware/'+drink.glass.toLowerCase()+'.svg&backup=glassware/unknown.svg'} alt={drink.glass+' glass'}/>}
                {!drink.glass && <img className="menu-card-drink-entry-glass" src={'/api/image?file=glassware/unknown.svg'} alt={'No glass listed'}/>}
                <div className="menu-card-drink-entry-info">
                    <div className="menu-card-drink-entry-title">{drink.name}</div>
                    <div style={{display:"flex", marginTop:"5px"}}>
                        {drink.tags && drink.tags.map(tag=>{
                            return <div className="menu-card-drink-entry-tag" style={{backgroundColor:getColor(tag)}}></div>
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MenuCardDrinkEntry;