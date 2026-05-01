import React, {useEffect, useState} from "react"
import axios from "axios";
import AlcoholContentCardDrinkEntry from "./AlcoholContentCardDrinkEntry";
import "../../format/StatisticsTab.css";
import "../../format/AlcoholContentStatistics.css";
import {getColor} from "../../components/DrinkTags";

const AlcoholContentCard = ({ title, onDrinkClick, stat, listLength, sort }) => {

    const [statList, setStatList] = useState([]);

    useEffect(() => {
        fetchAlcoholContentStats();
    }, []);

    const fetchAlcoholContentStats = () => {
        axios.get(`/api/statistics?stat=${stat}&n=${listLength}&sort=${sort}`)
            .then((res) => {
                if (res.data) {
                    setStatList(res.data);
                }
            }).catch((err) => console.log(err));
    }

    return (
        <div className="alcohol-card">
            <h3 className="statistics-category-title">{title}</h3>
            {statList.length === 0 && <div className="statistics-empty">No drinks available</div>}
            {statList.map((drink, index) => {
                const value = drink[stat];
                const formattedValue = typeof value === 'number' ? value.toFixed(1) : '';
                const unitMap = {abv: '%', emu: ' EMU'};
                const unit = unitMap[stat] || '';
                return <AlcoholContentCardDrinkEntry drink={drink} formattedValue={formattedValue} unit={unit} onDrinkClick={onDrinkClick}/>
            })}
        </div>
    )
}

export default AlcoholContentCard;