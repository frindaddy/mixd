import React, { useState, useEffect } from "react";
import axios from "axios";
import drinkImg from "../../images/high-five.webp";
import {FaChevronLeft} from "react-icons/fa";
import DrinkTags from "../DrinkTags";
const DrinkInfo = ({drinkID, setCurrentPage}) => {

    const [drink, setDrink] = useState({name:"No Drink"});
    const [tags, setTags] = useState();

    const filterTags = () => {
        if(drink.tags){
            let fileredTags = drink.tags.filter((tag) =>{
                return tag.category === 'style' || tag.category === 'taste';
            });
            setTags(fileredTags);
        }
    }

    useEffect(() => {
        axios.get('api/drink/'+drinkID)
            .then((res) => {
                if (res.data) {
                    setDrink(res.data[0]);
                }
            }).catch((err) => console.log(err));
        filterTags();
    });

    return (
        <div className='DrinkInfo'>
            <nav>
                <div className="flex-container">
                    <div className="back" onClick={()=>{setCurrentPage('drinkList')}} style={{cursor: "pointer"}}><FaChevronLeft/></div>
                    <div className="nav-logo">mixd.</div>
                </div>
            </nav>

            <div className="row">
                <div className="drink-column">
                    <div className="image">
                        <img src={drinkImg} alt={drink.name} />
                    </div>
                </div>
                <div className="drink-column">
                    <div className="text">
                        <h1>{drink.name}</h1>
                        {tags && <DrinkTags tags={tags}/>}
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