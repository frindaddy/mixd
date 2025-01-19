import React, {useEffect, useState} from "react"
import {FaChevronLeft} from "react-icons/fa";
import axios from "axios";
import GlassTypes from "./GlassTypes";
import TagEntryContainer from "./TagEntryContainer";
import IngredientEntryContainer from "./IngredientEntryContainer";
const CreateDrink = ({setCurrentPage, drinkID, adminKey}) => {
    const noImageURL = './api/image?file=glassware/unknown.svg';
    const [imagePreviewURL, setImagePreviewURL] = useState(noImageURL);
    const [selectedImage, setSelectedImage] = useState(null);
    const [inputs, setInputs] = useState({});
    const [allIngredients, setAllIngredients] = useState([]);
    const [imageUUID, setImageUUID] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        if (drinkID){
            axios.get('api/drink/'+drinkID)
                .then((res) => {
                    if (res.data) {
                        setInputs(res.data);
                        setImagePreviewURL('./api/image?file=user_drinks/'+res.data.image+'.jpg&backup=glassware/unknown.svg');
                    }
                }).catch((err) => console.log(err));
        }
        axios.get('api/get_ingredients')
            .then((res) => {
                if (res.data) {
                    setAllIngredients(res.data);
                }
            }).catch((err) => console.log(err));
    }, [drinkID]);

    const onImageSelected = (e) => {
        if(e.target.files && e.target.files[0]){
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
                    Authorization: `Bearer ${adminKey}`,
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
        if (drink.tags) {
            drink.tags.map((tag) => {
                if(tag.category && tag.value){
                    tags = [...tags, tag];
                }
            });
        }
        if (drink.ingredients) {
            drink.ingredients.map((ingredient) => {
                if(ingredient.ingredient){
                    if (typeof ingredient.amount === "string"){
                        ingredient.amount = parseFloat(ingredient.amount.replace(",", "."));
                    }
                    let ingIndex = allIngredients.findIndex(ing => ing.name === ingredient.ingredient)
                    if(ingIndex !== -1){
                        ingredient.ingredient = allIngredients[ingIndex].uuid
                    }
                    ingredients = [...ingredients, ingredient];
                }
            });
        }

        drink.tags = tags;
        drink.ingredients = ingredients;
        if (typeof drink.abv === "string"){
            drink.abv = parseFloat((drink.abv||"").replace(",", "."));
        }
        
        return drink;
    }

    const validateDrink = (drink) => {
        if (!drink.name) { return 'Drink name is required!' }
        if (drink.tags.length < 1) { return 'Drink tags are required!' }
        if (drink.ingredients.length < 1) { return 'Ingredients are required!' }
    }

    async function postDrink(drink) {
        const response = await axios.post('./api/add_drink', drink, {
                headers: {
                    Authorization: `Bearer ${adminKey}`,
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
    async function deleteDrink(sameImage, drinkID) {
        axios.delete('api/drink/'+drinkID+(sameImage ? '?saveImg=true':''), {headers:{Authorization: `Bearer ${adminKey}`}})
            .then((res) => {
                if (res.data) {
                    console.log(res.data[0]);
                }
            }).catch((err) => console.log(err));
    }

    const updateDrink = async () => {
        let sameImage = !selectedImage;
        await deleteDrink(sameImage && imagePreviewURL !== noImageURL, drinkID);
        await createDrink(sameImage);
    }

    const createDrink = async (sameImage) => {
        let uuid = imageUUID;
        if (!imageUUID && !sameImage && imagePreviewURL !== noImageURL){
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
        <div className='add-new-drink'>
            <nav>
                <div className="nav-container">
                    <a href="/" className="back" onClick={()=>{setCurrentPage('drinkList')}} style={{cursor: "pointer"}}><FaChevronLeft/></a>
                    <div className="nav-logo">mixd.</div>
                </div>
            </nav>

            <div style={{flexDirection: "column", width: "100%"}}>
                <h1 className="create-drink-title">{drinkID === null ? 'Add New Drink':'Update Existing Drink'}</h1>
                {errorMsg && <p style={{color:"red"}}>{"ERROR: "+errorMsg}</p>}

                <div className="create-drink-image">
                    <img style={{width:300, height: 420, overflow:"hidden"}} src={imagePreviewURL} alt='Drink Preview'/>
                    {(drinkID !== null) && <p style={{cursor: "pointer"}} onClick={()=>{setImagePreviewURL(noImageURL)}}>Remove Image</p>}
                    <p>Drink Preview</p>
                    <input type="file" onChange={onImageSelected}/>
                </div>
                <p>Name (Required):</p>
                <div className="create-drink-row">
                    <input type="text" name="name" placeholder="Manhattan" value={inputs.name || ""} onChange={handleFormChange} />
                </div>
                <div className="create-drink-row">
                    {drinkID && <p>{'UUID: ' + drinkID}</p>}
                </div>
                <p>Glass:</p>
                <div className="create-drink-row">
                    <select name="glass" onChange={handleFormChange}>
                        <option value='no_drink' disabled={true} selected={!inputs.glass}>No Glass</option>
                        {GlassTypes.map((glass)=> {
                            return <option value={glass.name} selected={inputs.glass===glass.name}>{glass.displayName}</option>
                        })}
                    </select>
                </div>
                <p>Ingredients (Required):</p>
                <div className="create-drink-row">
                    <IngredientEntryContainer inputs={inputs}  setInputs={setInputs} allIngredients={allIngredients}/>
                </div>
                <p>Garnish:</p>
                <div className="create-drink-row">
                    <input type="text" name="garnish" placeholder="a maraschino cherry" value={inputs.garnish || ""} onChange={handleFormChange} />
                </div>
                <p>ABV:</p>
                <div className="create-drink-row">
                    <input type="text" name="abv" placeholder="0.0" value={inputs.abv || ""} onChange={handleFormChange} />
                </div>
                <p>Override Drink Volume (oz):</p>
                <div className="create-drink-row">
                    <input type="text" name="override_volume" placeholder="4" value={inputs.override_volume || ""} onChange={handleFormChange} />
                </div>
                <p>Instructions:</p>
                <div className="create-drink-row">
                    <textarea name="instructions" rows="6" cols="45" value={inputs.instructions || ""} onChange={handleFormChange} />
                </div>
                <p>Description:</p>
                <div className="create-drink-row">
                    <textarea name="description" rows="6" cols="45" value={inputs.description || ""} onChange={handleFormChange} />
                </div>
                <p>Footnotes:</p>
                <div className="create-drink-row">
                    <textarea name="footnotes" rows="3" cols="45" value={inputs.footnotes || ""} onChange={handleFormChange} />
                </div>
                <p style={{marginTop: "50px", marginBottom: "-35px"}}>Tags (Required):</p>
                <div className="create-drink-row">
                    <TagEntryContainer inputs={inputs} setInputs={setInputs}/>
                </div>
                <div className="create-drink-row">
                    <button onClick={()=>{drinkID === null ? createDrink(false):updateDrink()}}>{drinkID === null ? 'Add New Drink':'Update Drink'}</button>
                </div>
            </div>
        </div>
    )
}

export default CreateDrink;