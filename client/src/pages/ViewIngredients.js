import React, {useEffect, useState} from "react"
import {FaSortAmountDown} from "react-icons/fa";
import axios from "axios";
import IngredientListEntry from "../components/Ingredients/IngredientListEntry";
import "../format/ViewIngredients.css";

const ViewIngredients = ({setIngrFilter}) => {
    const [ingredients, setIngredients] = useState([]);
    const [sortedIngredients, setSortedIngredients] = useState([]);
    const [sorted, setSorted] = useState(false);

    useEffect(() => {
        document.title = 'Ingredients | mixd.';
        fetchIngredients();
    }, []);

    const fetchIngredients = () => {
        axios.get('/api/count_ingredients')
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
            <div style={{display: "flex", justifyContent: "center", alignItems:"center", marginLeft:"-53px"}}>
                <FaSortAmountDown className="sorted-filter-icon" style={{backgroundColor: sorted? "3B3D3F":""}} onClick={()=>{setSorted(!sorted)}}/>
                <h1 className="all-ingredients-title">All Ingredients</h1>
            </div>
            {(sorted ? sortedIngredients:ingredients).map((ingredient) =>{
                return <div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {ingredient.count > 0 && <IngredientListEntry ingredient={ingredient} setIngrFilter={setIngrFilter}/>}
                    </div>
                </div>;
            })}
        </div>
    )
}

export default ViewIngredients;