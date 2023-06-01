import React, {useEffect, useState} from "react"
import {FaChevronLeft} from "react-icons/fa";
import axios from "axios";
import GlassTypes from "./GlassTypes";
import TagEntryContainer from "./TagEntryContainer";
import IngredientEntryContainer from "./IngredientEntryContainer";
const CreateDrink = ({setCurrentPage, drinkID}) => {
    const noImageURL = './api/image?file=glassware/unknown.svg';
    const [imagePreviewURL, setImagePreviewURL] = useState(noImageURL);
    const [selectedImage, setSelectedImage] = useState(null);
    const [inputs, setInputs] = useState({});
    const [imageUUID, setImageUUID] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    //const [drink, setDrink] = useState({name:"High-Five"});

    useEffect(() => {
        if (drinkID){
            axios.get('api/drink/'+drinkID)
                .then((res) => {
                    if (res.data) {
                        setInputs(res.data[0]);
                        setImagePreviewURL('./api/image?file=user_drinks/'+res.data[0].image+'.jpg&backup=glassware/unknown.svg');
                    }
                }).catch((err) => console.log(err));
        }

    }, [drinkID]);

    const onImageSelected = (e) => {
        if(e.target.files){
            setImagePreviewURL(URL.createObjectURL(e.target.files[0]));
            setSelectedImage(e.target.files[0]);
        } else {
            setImagePreviewURL(noImageURL);
            setSelectedImage(null);
        }

    }
    const uploadImage = async () => {
        const {data} = await axios.post('./api/image', {
                text: 'data',
                drinkImage: selectedImage
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        if (data.imageUUID) {
            return data.imageUUID;
        } else {
            console.error(data.error);
            return null;
        }
    }

    const handleFormChange = (event) => {
        setInputs(values => ({...values, [event.target.name]: event.target.value}))
    }

    const parseDrink = (drink) => {
        let tags = [];
        let ingredients = [];
        drink.tags.map((tag) => {
            if(tag.category && tag.value){
                tags = [...tags, tag];
            }
        });
        drink.ingredients.map((ingredient) => {
            if(ingredient.unit && ingredient.ingredient){
                if (typeof ingredient.amount === "string"){
                    ingredient.amount = parseFloat(ingredient.amount.replace(",", "."));
                }
                ingredients = [...ingredients, ingredient];
            }
        });
        drink.tags = tags;
        drink.ingredients = ingredients;
        drink.abv = parseFloat((drink.abv||"").replace(",", "."));
        return drink;
    }

    const validateDrink = (drink) => {
        if (!drink.name) { return 'Drink name is required!' }
        if (drink.tags.length < 1) { return 'Drink tags are required!' }
    }

    async function postDrink(drink) {
        const response = await axios.post('./api/add_drink', drink, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        if(response.status !== 200) {
            setErrorMsg('Failed to add drink. Internal server error '+response.status);
        } else {
            setCurrentPage('drinkList');
        }
    }

    const updateDrink = async () => {

    }

    const createDrink = async () => {
        let uuid = imageUUID;
        if (!imageUUID){
            uuid = await uploadImage();
            setImageUUID(uuid);
        }
        let drink = {};
        if (uuid) {
            drink = parseDrink({...inputs, image:uuid});
        } else {
            drink = parseDrink(inputs);
        }
        let error = validateDrink(drink);
        if (error) {
            setErrorMsg(error);
        } else {
            await postDrink(drink);
        }
    }

    return (
        <div className='DrinkInfo'>
            <nav>
                <div className="nav-container">
                    <a href="/" className="back" onClick={()=>{setCurrentPage('drinkList')}} style={{cursor: "pointer"}}><FaChevronLeft/></a>
                    <div className="nav-logo">mixd.</div>
                </div>
            </nav>

            <div style={{flexDirection: "column", width: "100%"}}>
                <h1>{drinkID === null ? 'Add New Drink':'Update Existing Drink'}</h1>
                {errorMsg && <p>{"ERROR: "+errorMsg}</p>}
                <div className="create-drink-image">
                    <img style={{width:300, height: 420, overflow:"hidden"}} src={imagePreviewURL} alt='Drink Preview'/>
                    <p>Drink Preview</p>
                    <input type="file" onChange={onImageSelected}/>
                </div>
                <div className="create-drink-row">
                    <p>Name:</p>
                    <input type="text" name="name" placeholder="Manhattan" value={inputs.name || ""} onChange={handleFormChange} />
                </div>
                <TagEntryContainer setInputs={setInputs}/>
                <div className="create-drink-row">
                    <p>ABV: </p>
                    <input type="text" name="abv" placeholder="0.0" value={inputs.abv || ""} onChange={handleFormChange} />
                </div>
                <div className="create-drink-row">
                    <p>Glass:</p>
                    <select name="glass" onChange={handleFormChange}>
                        <option value='no_drink' disabled={true} selected={!inputs.glass}>No Glass</option>
                        {GlassTypes.map((glass)=> {
                            return <option value={glass.name} selected={inputs.glass===glass.name}>{glass.displayName}</option>
                        })}
                    </select>
                </div>
                <IngredientEntryContainer setInputs={setInputs}/>
                <div className="create-drink-row">
                    <p>Garnish:</p>
                    <input type="text" name="garnish" placeholder="a maraschino cherry" value={inputs.garnish || ""} onChange={handleFormChange} />
                </div>
                <div className="create-drink-row">
                    <p>Description:</p>
                    <textarea name="description" value={inputs.description || ""} onChange={handleFormChange} />
                </div>
                <div className="create-drink-row">
                    <p>Footnotes:</p>
                    <textarea name="footnotes" value={inputs.footnotes || ""} onChange={handleFormChange} />
                </div>
                <div className="create-drink-row">
                    <button onClick={drinkID === null ? createDrink:updateDrink}>{drinkID === null ? 'Add New Drink':'Update Drink'}</button>
                </div>
            </div>
        </div>
    )
}

export default CreateDrink;