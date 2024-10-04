import React, { useState, useEffect } from "react";
import axios from "axios";
import {FaChevronLeft} from "react-icons/fa";
import DrinkTags, {filterTags} from "../DrinkTags";
import {getDisplayName} from "../Admin/GlassTypes";
import LinkableText from "./LinkableText";
const DrinkInfo = ({drinkID, setCurrentPage, setCurrentDrink}) => {

    const [drink, setDrink] = useState({name:"No Drink"});
    const [drinkLoaded, setDrinkLoaded] = useState(false);
    const [drinkFailed, setDrinkFailed] = useState(false);

    useEffect(() => {
        axios.get('api/drink/'+drinkID)
            .then((res) => {
                if (res.data) {
                    setDrink(res.data);
                    setDrinkLoaded(true);
                } else {
                    setDrinkFailed(true);
                }
            }).catch((err) => console.log(err));
    }, [drinkID]);

    return (
        <div className='DrinkInfo'>
            <nav>
                <div className="nav-container" onClick={()=>{setCurrentPage('drinkList')}}>
                    <a className="back" style={{cursor: "pointer"}}><FaChevronLeft/></a>
                    <div className="nav-logo">mixd.</div>
                </div>
            </nav>

            {drinkFailed && <p style={{textAlign: "center"}}>Error: Failed to Get Drink Information</p>}
            {drinkLoaded && <div className="info-row">
                <div className="info-column">
                    <div className="image">
                        <img src={'./api/image?file=user_drinks/'+drink.image+'.jpg&backup=glassware/no_img.svg'} alt={drink.name} />
                    </div>
                </div>
                <div className="info-column">
                    <div className="info-text">
                        <div className="info-title">{drink.name}</div>
                        {drink.tags && <DrinkTags tags={filterTags(drink.tags, ['style', 'taste', 'recommendation'])} glass={getDisplayName(drink.glass)}/>}
                        <div style={{display: "flex"}}>
                            {drink.abv != null && <div className="abv">{drink.abv}% ABV</div>}
                            {drink.volume != null && <div className="volume"> / {drink.volume}</div>}
                        </div>
                        <ul className="ingredients">
                            { drink.ingredients && drink.ingredients.map((ingredient) => {
                                if(ingredient.amount > 0){
                                    return <li>{ingredient.amount} {ingredient.unit} {ingredient.ingredient}</li>
                                } else {
                                    return <li>{ingredient.unit} {ingredient.ingredient}</li>
                                }
                            })}
                            {drink.garnish && <li>Garnished with {drink.garnish}</li>}
                        </ul>
                        {drink.instructions && <LinkableText className="instructions" rawBodyText={drink.instructions} setCurrentDrink={setCurrentDrink} />}
                        {drink.description && <LinkableText className="description" rawBodyText={drink.description} setCurrentDrink={setCurrentDrink} />}
                        {drink.footnotes && <LinkableText className="footnote" rawBodyText={drink.footnotes} setCurrentDrink={setCurrentDrink} />}
                    </div>
                </div>
            </div> }
        </div>
    )
}

export default DrinkInfo;