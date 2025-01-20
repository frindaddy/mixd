import React, {useEffect, useState} from "react"
import {FaChevronLeft, FaSortAmountDown} from "react-icons/fa";
import axios from "axios";
import IngredientListEntry from "./IngredientListEntry";
import "../../format/ViewIngredients.css";

const ViewIngredients = ({setCurrentPage, setIngrFilter}) => {
    const [ingredients, setIngredients] = useState([]);
    const [sortedIngredients, setSortedIngredients] = useState([]);
    const [sorted, setSorted] = useState(false);

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = () => {
        axios.get('api/count_ingredients')
            .then((res) => {
                if (res.data) {
                    setIngredients(res.data);
                    const clone = res.data.map( x => { return {...x}} )
                    setSortedIngredients(clone.sort((a, b) => {
                        if(a.count > b.count) return -1;
                        if(a.count < b.count) return 1;
                        return 0;
                    }));
                }
            }).catch((err) => console.log(err));
    }

    return (
        <div>
            <nav>
                <div className="nav-container">
                    <a href="/" className="back" onClick={()=>{setCurrentPage('drinkList')}} style={{cursor: "pointer"}}><FaChevronLeft/></a>
                    <div className="nav-logo">mixd.</div>
                </div>
            </nav>
            <div>
                <FaSortAmountDown className="sorted-filter-icon" style={{backgroundColor: sorted? "3B3D3F":""}} onClick={()=>{setSorted(!sorted)}}/>
                <h1 className="all-ingredients-title" style={{paddingBottom: "20px"}}>All Ingredients:</h1>
                {(sorted ? sortedIngredients:ingredients).map((ingredient) =>{
                    return <div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            {ingredient.count > 0 && <IngredientListEntry ingredient={ingredient} setCurrentPage={setCurrentPage} setIngrFilter={setIngrFilter}/>}
                        </div>
                    </div>;
                })}
            </div>
        </div>
    )
}

export default ViewIngredients;