import React, {useEffect, useState} from "react"
import GlassTypes from "../Admin/GlassTypes";

const FilterPanel = ({setGlassFilterList}) => {

    const [filteredTags, setFilteredTags] = useState([]);
    const [glassInputs, setGlassInputs] = useState({});

    useEffect(() => {
        console.log(glassInputs);
        let glassFilterList = [];
        GlassTypes.forEach((glass) => {
           if (glassInputs[glass.name] === true) {
               glassFilterList.push(glass.name);
           }
        });
        setGlassFilterList(glassFilterList);
    }, [glassInputs]);

    function handleGlassChange(e) {
        setGlassInputs({...glassInputs, [e.target.name]:e.target.checked});
    }

    function resetAllFilters() {
        setGlassInputs({});
    }

    return (
        <div>
            <hr/>
            <p>Glasses</p>
            {GlassTypes.map((glass) => {
               return  <label><input type="checkbox" checked={glassInputs[glass.name]} name={glass.name} onChange={handleGlassChange}/>{glass.displayName}</label>
            })}
            <hr/>
            <p onClick={resetAllFilters} style={{cursor:"pointer"}}>RESET</p>
        </div>
    )
}

export default FilterPanel;