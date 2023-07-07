import React, {useEffect, useState} from "react"
import GlassTypes from "../Admin/GlassTypes";
import axios from "axios";

const FilterPanel = ({setTagFilterList, setGlassFilterList}) => {

    const [allTags, setAllTags] = useState([]);
    const [tagInputs, setTagInputs] = useState({});
    const [defaultTagInputs, setDefaultTagInputs] = useState({});
    const [glassInputs, setGlassInputs] = useState({});

    useEffect(() => {
        axios.get('./api/tags/')
            .then((res) => {
                if (res.data) {
                    setAllTags(res.data);
                    let init = {}
                    Object.keys(res.data).forEach((cat)=>{
                        init[cat] = [];
                    });
                    setTagInputs(init);
                    setDefaultTagInputs(init);
                }
            }).catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        let glassFilterList = [];
        GlassTypes.forEach((glass) => {
           if (glassInputs[glass.name] === true) {
               glassFilterList.push(glass.name);
           }
        });
        setGlassFilterList(glassFilterList);
    }, [glassInputs]);

    useEffect(() => {
        let tagFilterList = [];
        Object.keys(tagInputs).forEach((category) => {
            Object.keys(tagInputs[category]).forEach((tagValue) => {
                if (tagInputs[category][tagValue]) {
                    tagFilterList.push({category: category, value: tagValue});
                }
            })
        });
        setTagFilterList(tagFilterList);
    }, [tagInputs]);

    function handleGlassChange(e) {
        setGlassInputs({...glassInputs, [e.target.name]:e.target.checked});
    }

    const handleTagChange = (category) => (e) =>{
        setTagInputs({...tagInputs, [category]:{...tagInputs[category], [e.target.name]:e.target.checked}});
    }
    function resetAllFilters() {
        setGlassInputs({});
        setTagInputs(defaultTagInputs);
    }

    return (
        <div>
            {Object.keys(allTags).map((cat)=>{
                return <div>
                    <hr />
                    <p>{cat.charAt(0).toUpperCase() + cat.slice(1)}</p>
                    {allTags[cat].map((tagName)=>{
                        return <label><input type="checkbox" checked={tagInputs[cat][tagName]} name={tagName} onChange={handleTagChange(cat)}/>{tagName}</label>
                    })}
                </div>
            })}
            <hr/>
            <p>Glasses</p>
            {GlassTypes.map((glass) => {
               return <label><input type="checkbox" checked={glassInputs[glass.name]} name={glass.name} onChange={handleGlassChange}/>{glass.displayName}</label>
            })}
            <hr/>
            <p onClick={resetAllFilters} style={{cursor:"pointer"}}>RESET</p>
        </div>
    )
}

export default FilterPanel;