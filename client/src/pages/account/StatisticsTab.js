import React, {useEffect, useState} from "react"
import axios from "axios";
import IngredientListEntry from "../../components/Ingredients/IngredientListEntry";
import AlcoholContentCard from "../../components/Statistics/AlcoholContentCard";
import "../../format/StatisticsTab.css";
import "../../format/AlcoholContentStatistics.css";
import "../../format/Tabs.css";
import {useNavigate} from "react-router-dom";
import IngredientCategories from "../../definitions/IngredientCategories";
import {getColor} from "../../components/DrinkTags";

const ALCOHOL_STATS_LIST_LENGTH = process.env.ALCOHOL_STATS_LIST_LENGTH || 10;

const StatisticsTab = ({setSearchIngredient}) => {
    const [ingredients, setIngredients] = useState([]);
    const [highestAbvDrinks, setHighestAbvDrinks] = useState([]);
    const [lowestAbvDrinks, setLowestAbvDrinks] = useState([]);
    const [highestEmuDrinks, setHighestEmuDrinks] = useState([]);
    const [lowestEmuDrinks, setLowestEmuDrinks] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = () => {
        axios.get('/api/count_ingredients')
            .then((res) => {
                if (res.data) {
                    setIngredients(res.data);
                }
            }).catch((err) => console.log(err));
    }

    const onIngredientClick = (ingredient) => {
        setSearchIngredient(ingredient.uuid);
        navigate('/');
    };

    const renderAlcoholStatContainer = (title, drinks, valueKey, unit) => (
        <div className="alcohol-card">
            <h3 className="statistics-category-title">{title}</h3>
            {drinks.length === 0 && <div className="statistics-empty">No drinks available</div>}
            {drinks.map((drink, index) => {
                const value = drink[valueKey];
                const formattedValue = typeof value === 'number' ? value.toFixed(1) : '';
                return (
                    <React.Fragment key={drink.uuid}>
                        {index > 0 && <hr className="alcohol-card-hr"/>}
                        <div className="alcohol-card-drink-entry" onClick={() => onDrinkClick(drink)}>
                            <div className="alcohol-card-drink-entry-left">
                                {drink.glass ?
                                    <img className="alcohol-card-drink-entry-glass" src={`/api/image?file=glassware/${drink.glass.toLowerCase()}.svg&backup=glassware/unknown.svg`} alt={`${drink.glass} glass`} /> :
                                    <img className="alcohol-card-drink-entry-glass" src="/api/image?file=glassware/unknown.svg" alt="No glass listed" />
                                }
                                <div className="alcohol-card-drink-entry-info">
                                    <div className="alcohol-card-drink-entry-title">{drink.name}</div>
                                    <div style={{display: "flex", marginTop: "5px"}}>
                                        {drink.tags && drink.tags.map((tag, index) => (
                                            <div key={index} className="alcohol-card-drink-entry-tag" style={{backgroundColor: getColor(tag)}}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <span className="alcohol-card-abv-value">{formattedValue}{unit}</span>
                        </div>
                    </React.Fragment>
                )
            })}
        </div>
    );

    const onDrinkClick = (drink) => {
        const identifier = drink.url_name || drink.uuid;
        navigate(`/${identifier}`);
    };

    return (
        <>
            <h1 className="tab-title">Statistics</h1>
            <h2 className="tab-subtitle">Alcohol Content</h2>
            <p className="statistics-sort-instructions">Top {ALCOHOL_STATS_LIST_LENGTH} most and least alcoholic drinks!</p>
            <div className="statistics-usage-container">
                <AlcoholContentCard title="Highest ABV" onDrinkClick={onDrinkClick} stat="abv" listLength={ALCOHOL_STATS_LIST_LENGTH} sort="desc"/>
                <AlcoholContentCard title="Lowest ABV" onDrinkClick={onDrinkClick} stat="abv" listLength={ALCOHOL_STATS_LIST_LENGTH} sort="asc"/>
                <AlcoholContentCard title="Highest EMU" onDrinkClick={onDrinkClick} stat="emu" listLength={ALCOHOL_STATS_LIST_LENGTH} sort="desc"/>
                <AlcoholContentCard title="Lowest EMU" onDrinkClick={onDrinkClick} stat="emu" listLength={ALCOHOL_STATS_LIST_LENGTH} sort="asc"/>
            </div>
            <hr></hr>
            <h2 className="tab-subtitle">Ingredient Usage</h2>
            <p className="statistics-sort-instructions">Click on an ingredient to show all drinks using that ingredient!</p>
            <div className="statistics-usage-container">
                {IngredientCategories.map(category => {
                    let category_ingr = ingredients.filter(ingr => ingr.category === category.name);
                    if(category_ingr.length === 0) return <></>
                    return <div className="statistics-category-container">
                        <h3 className="statistics-category-title">{category.header}</h3>
                        {category_ingr.map((ingredient) =>{
                            return <div>
                                {ingredient.count > 0 && <IngredientListEntry ingredient={ingredient} onIngredientClick={onIngredientClick}/>}
                            </div>;
                        })}
                    </div>
                })}
            </div>
        </>
    )
}

export default StatisticsTab;
