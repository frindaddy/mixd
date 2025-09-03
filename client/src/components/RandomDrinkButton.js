import {useState, useEffect} from "react";
import axios from 'axios';
import {FaRandom} from "react-icons/fa";
import "../format/DrinkList.css";
import {Link} from "react-router-dom";

const RandomDrinkButton = () => {

    const [randomDrink, setRandomDrink] = useState([]);

    useEffect(() => {
        getRandomDrink();
    }, []);

    function getRandomDrink() {
        axios.get('/api/random/drink')
            .then((res) => {
                if (res.data) {
                    console.log(res.data);
                    setRandomDrink(res.data[0]);
                }
            }).catch((err) => console.log(err));
    }

    return (
        <Link to={'/'+randomDrink.url_name} style={{display:"flex"}} className="random-drink-button"><FaRandom/></Link>
    )
}

export default RandomDrinkButton;