import "../format/DrinkInfo.css";
import "../format/DrinkMultiplier.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DrinkTags, {filterTags} from "../components/DrinkTags";
import LinkableText from "../components/DrinkInfo/LinkableText";
import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";

const DrinkInfo = ({setShowLoader}) => {

    const { drink_identifier } = useParams();
    const navigate = useNavigate();

    const [drink, setDrink] = useState({name:"No Drink"});
    const [drinkLoaded, setDrinkLoaded] = useState(false);
    const [drinkFailed, setDrinkFailed] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [drinkMultiplier, setDrinkMultiplier] = useState(1);

    useEffect(() => {
        setShowLoader(true);
        setDrinkFailed(false);
        setDrinkLoaded(false);
        axios.get('/api/drink/'+drink_identifier)
            .then((res) => {
                if (res.data) {
                    if(!res.data.uuid) navigate('/404', {replace: true});
                    if(drink_identifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i) && res.data.url_name){
                        navigate('/'+res.data.url_name, {replace: true});
                    }
                    if (res.data.name) document.title = res.data.name+' | mixd.';
                    if(res.data.instructions){
                        res.data.instructions = res.data.instructions.split(/\r\n|\r|\n/g)
                    }
                    if(res.data.description){
                        res.data.description = res.data.description.split(/\r\n|\r|\n/g)
                    }
                    if(res.data.footnotes){
                        res.data.footnotes = res.data.footnotes.split(/\r\n|\r|\n/g)
                    }
                    setDrink(res.data);
                    setDrinkLoaded(true);
                } else {
                    setDrinkFailed(true);
                    setDrinkLoaded(false);
                    navigate('/404', {replace: true});
                }
            }).catch((err) => {
                setDrinkFailed(true);
                setDrinkLoaded(false);
                navigate('/404', {replace: true});
        });
    }, [drink_identifier]);

    function getVolume() {
        if (drink.override_volume && drink.override_volume > 0) return drink.override_volume
        if (drink.volume && drink.volume > 0) return drink.volume
        return 0
    }

    function onImageLoad(){
        setImageLoaded(true);
        setShowLoader(false);
    }

    return (
        <div>
            {drinkFailed && <p style={{textAlign: "center"}}>Invalid drink ID. This drink does not exist.</p>}
            {!drinkFailed && drinkLoaded && <div>
                <img src={'/api/image?file=user_drinks/'+drink.image+'.jpg&backup=glassware/no_img.svg'} alt={drink.name} onLoad={onImageLoad} style={{display: "none"}}/>
                {imageLoaded && <div className="info-row">
                    <div className="info-column">
                        <div className="drink-image">
                            <img src={'/api/image?file=user_drinks/'+drink.image+'.jpg&backup=glassware/no_img.svg'} alt={drink.name} />
                        </div>
                    </div>
                    <div className="info-column">
                        <div className="info-text">
                            <div className="info-title">{drink.name}</div>
                            {drink.tags && <DrinkTags tags={filterTags(drink.tags, ['style', 'taste', 'recommendation'])} />}
                            <div style={{display: "flex"}}>
                                {drink.etoh != null && getVolume() !== 0 && <div className="abv">{Math.round(10*drink.etoh/getVolume())/10}% ABV</div>}
                                {(drink.volume != null || drink.override_volume != null) && <div className="volume"> / {getVolume()} oz</div>}
                                {drink.etoh != null && <div className="emu">({Math.round(drink.etoh/5.04)/10} EMU)</div>}
                            </div>
                            <div>
                                <p>{drink.menu_desc}</p>
                            </div>
                            <div className="drink-multiplier-container">
                                <button className="multiplier-minus" onClick={() => setDrinkMultiplier(Math.max(1, drinkMultiplier - 1))}>-</button>
                                <input type="number" value={drinkMultiplier} min="1" className="multiplier-quantity"/>
                                <button value="+" className="multiplier-plus" onClick={() => setDrinkMultiplier(drinkMultiplier + 1)}>+</button>
                            </div>
                            <ul className="ingredients">
                                { drink.ingredients && drink.ingredients.map((ingredient) => {
                                    if(ingredient.amount > 0){
                                        return <li>{ingredient.amount * drinkMultiplier} {ingredient.unit} {ingredient.ingredient}</li>
                                    } else {
                                        return <li>{ingredient.unit} {ingredient.ingredient}</li>
                                    }
                                })}
                                {drink.garnish && <li>Garnished with {drink.garnish}</li>}
                            </ul>
                            <div className="instructions">
                                {drink.instructions && drink.instructions.map(line=>{
                                    return <LinkableText rawBodyText={line} />
                                })}
                            </div>
                            <div className="description">
                                {drink.description && drink.description.map(line=>{
                                    return <LinkableText rawBodyText={line} />
                                })}
                            </div>
                            <div className="footnote">
                                {drink.footnotes && drink.footnotes.map(line=>{
                                    return <LinkableText rawBodyText={line} />
                                })}
                            </div>
                        </div>
                    </div>
                </div>}
            </div>}
        </div>
    )
}

export default DrinkInfo;