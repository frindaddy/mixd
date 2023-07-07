import React, {useEffect, useState} from "react"
import GlassTypes from "../Admin/GlassTypes";
import axios from "axios";
import {FaEraser} from "react-icons/fa";

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
        <div className='filter-panel-child'>
            {Object.keys(allTags).map((cat)=>{
                return <div className='filter-column'>
                    <p>{cat.charAt(0).toUpperCase() + cat.slice(1)}</p>
                    <ul>
                        {allTags[cat].map((tagName)=>{
                            return <li><label><input type="checkbox" checked={tagInputs[cat][tagName]} name={tagName} onChange={handleTagChange(cat)}/>{tagName}</label></li>
                        })}
                    </ul>
                </div>
            })}
            <div className='filter-column'>
                <p>Glass (Hard Filter)</p>
                <ul>
                    {GlassTypes.map((glass) => {
                        return <li><label><input type="checkbox" checked={glassInputs[glass.name]} name={glass.name} onChange={handleGlassChange}/>{glass.displayName}</label></li>
                    })}
                </ul>
            </div>
            <div className='filter-erase'><FaEraser onClick={resetAllFilters} style={{cursor:"pointer"}}/></div>
        </div>
    )
}

export default FilterPanel;