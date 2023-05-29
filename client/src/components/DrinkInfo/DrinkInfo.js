import React, { useState, useEffect } from "react";
import axios from "axios";
import drinkImg from "../../images/high-five.webp";
const DrinkInfo = ({drinkID, setCurrentPage}) => {

    const [drink, setDrink] = useState({name:"No Drink"});

    useEffect(() => {
        axios.get('api/drink/'+drinkID)
            .then((res) => {
                if (res.data) {
                    setDrink(res.data[0]);
                }
            }).catch((err) => console.log(err));
    });

    return (
        <div className='DrinkInfo'>
            <nav>
                <div>
                    <div className="nav-logo">mixd.</div>
                </div>
            </nav>
            <div className="back">
                <p onClick={()=>{setCurrentPage('drinkList')}} style={{cursor: "pointer"}}>← back to menu</p>
            </div>
            <div className="row">
                <div className="drink-column">
                    <div className="image">
                        <img src={drinkImg} alt="Orange coctail on a wooden board" />
                    </div>
                </div>
                <div className="column">
                    <div className="text">
                        <h1>{drink.name}</h1>
                        <div className="flex-container">
                            <div className="tag gin">Gin</div>
                            <div className="tag aperol">Aperol</div>
                            <div className="tag light">Light</div>
                            <div className="tag citrus">Citrus</div>
                        </div>
                        {drink.abv && <p>{drink.abv}% ABV</p>}
                        <ul>
                            { drink.ingredients && drink.ingredients.map((ingredient) => {
                                if(ingredient.amount > 0){
                                    return <li>{ingredient.amount} {ingredient.unit} {ingredient.ingredient}</li>
                                } else {
                                    return <li>{ingredient.unit} {ingredient.ingredient}</li>
                                }
                            })}
                            {drink.garnish && <li>Garnish: {drink.garnish}</li>}
                        </ul>
                        {drink.description && <p className="desc">{drink.description}</p>}
                        {drink.footnotes && <p className="footnote">{drink.footnotes}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DrinkInfo;