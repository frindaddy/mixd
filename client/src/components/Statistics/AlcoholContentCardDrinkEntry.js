import { getColor } from "../DrinkTags";
import "../../format/AlcoholContentStatistics.css"

const AlcoholContentCardDrinkEntry = ({drink, formattedValue, unit, onDrinkClick}) => {
    
    return (
        <>
            <hr className="alcohol-card-hr"/>
            <div className="alcohol-card-drink-entry" onClick={() => onDrinkClick(drink)}>
                <div className="alcohol-card-drink-entry-left">
                    {drink.glass ?
                        <img className="alcohol-card-drink-entry-glass" src={`/api/image?file=glassware/${drink.glass.toLowerCase()}.svg&backup=glassware/unknown.svg`} alt={`${drink.glass} glass`} /> :
                        <img className="alcohol-card-drink-entry-glass" src="/api/image?file=glassware/unknown.svg" alt="No glass listed" />
                    }
                    <div className="alcohol-card-drink-entry-info">
                        <div className="alcohol-card-drink-entry-title">{drink.name}</div>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            {drink.tags && drink.tags.map(tag => (
                                <div className="alcohol-card-drink-entry-tag" style={{backgroundColor: getColor(tag)}}></div>
                            ))}
                        </div>
                    </div>
                </div>
                <span className="alcohol-card-abv-value">{formattedValue}{unit}</span>
            </div>
        </>
    )
}

export default AlcoholContentCardDrinkEntry;