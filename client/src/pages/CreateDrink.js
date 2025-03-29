import React, {useEffect, useState} from "react"
import axios from "axios";
import GlassTypes from "../components/Admin/GlassTypes";
import TagEntryContainer from "../components/Admin/TagEntryContainer";
import IngredientEntryContainer from "../components/Admin/IngredientEntryContainer";
import "../format/CreateDrink.css";
import "../format/FilterPanel.css";
import {useNavigate, useParams} from "react-router-dom";

const CreateDrink = ({adminKey}) => {

    const navigate = useNavigate();
    const { uuid } = useParams();

    const noImageURL = '/api/image?file=glassware/unknown.svg';
    const [imagePreviewURL, setImagePreviewURL] = useState(noImageURL);
    const [selectedImage, setSelectedImage] = useState(null);
    const [inputs, setInputs] = useState({});
    const [allIngredients, setAllIngredients] = useState([]);
    const [imageUUID, setImageUUID] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loadedDrinkData, setLoadedDrinkData] = useState(false);

    useEffect(() => {
        document.title = (uuid ? 'Update':'Create')+' Drink | mixd.';
        setLoadedDrinkData(false);
        if (uuid){
            axios.get('/api/drink/'+uuid)
                .then((res) => {
                    if (res.data) {
                        setInputs(res.data);
                        setImagePreviewURL('/api/image?file=user_drinks/'+res.data.image+'.jpg&backup=glassware/unknown.svg');
                        setLoadedDrinkData(true);
                    } else {
                        console.error('Failed to load drink with uuid '+uuid);
                        navigate('/', { replace: true });
                    }
                }).catch((err) => {
                    console.error('Failed to load drink with uuid '+uuid);
                    navigate('/', { replace: true });
            });
        } else {
            setLoadedDrinkData(true);
        }
        axios.get('/api/get_ingredients')
            .then((res) => {
                if (res.data) {
                    setAllIngredients(res.data);
                }
            }).catch((err) => console.log(err));
    }, [uuid, navigate]);

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
        const {data} = await axios.post('/api/image', {
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
            drink.tags.forEach((tag) => {
                if(tag.category && tag.value){
                    tags = [...tags, tag];
                }
            });
        }
        if (drink.ingredients) {
            drink.ingredients.forEach((ingredient) => {
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
        if (typeof drink.override_volume === "string"){
            drink.override_volume = parseFloat((drink.override_volume||"").replace(",", "."));
        }
        
        return drink;
    }

    const validateDrink = (drink) => {
        if (!drink.name) { return 'Drink name is required!' }
        if (drink.tags.length < 1) { return 'Drink tags are required!' }
        if (drink.ingredients.length < 1) { return 'Ingredients are required!' }
    }

    async function postDrink(drink) {
        const response = await axios.post('/api/add_drink', drink, {
                headers: {
                    Authorization: `Bearer ${adminKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        if(response.status !== 200) {
            setErrorMsg('Failed to add drink. Internal server error '+response.status);
        } else {
            navigate('/', { replace: true });
        }
    }
    async function deleteDrink(sameImage, drinkID) {
        return new Promise((resolve, reject) => {
            axios.delete('/api/drink/'+drinkID+(sameImage ? '?saveImg=true':''), {headers:{Authorization: `Bearer ${adminKey}`}})
                .then((res) => {
                    if (res.data) {
                        console.log(res.data[0]);
                        resolve()
                    }
                }).catch((err) =>{
                    console.log(err)
                    reject(err);
                });
        });
    }

    const updateDrink = async () => {
        let sameImage = !selectedImage;
        deleteDrink(sameImage && imagePreviewURL !== noImageURL, uuid)
            .then(async ()=>{await createDrink(sameImage)})
            .catch(console.error('Failed to delete drink.'));
    }

    const createDrink = async (sameImage) => {
        let tempImageUUID = imageUUID;
        if (!imageUUID && !sameImage && imagePreviewURL !== noImageURL){
            tempImageUUID = await uploadImage();
            setImageUUID(tempImageUUID);
        }
        let drink = {};
        if (tempImageUUID) {
            drink = parseDrink({...inputs, image:tempImageUUID});
        } else {
            drink = parseDrink(inputs);
        }
        if(uuid) drink.uuid = uuid;
        let error = validateDrink(drink);
        if (error) {
            setErrorMsg(error);
        } else {
            await postDrink(drink);
        }
    }

    return (
        <div>
            {loadedDrinkData && <div className="create-drink" style={{flexDirection: "column", width: "100%"}}>
                <h1 className="create-drink-title">{uuid === undefined ? 'Add New Drink':'Update Existing Drink'}</h1>
                {errorMsg && <p style={{color:"red"}}>{"ERROR: "+errorMsg}</p>}

                <div className="create-drink-image">
                    <img style={{width:300, height: 420, overflow:"hidden"}} src={imagePreviewURL} alt='Drink Preview'/>
                    {(uuid !== undefined) && <p style={{padding:"15px", cursor: "pointer"}} onClick={()=>{setImagePreviewURL(noImageURL)}}>Remove Image</p>}
                    {!inputs.image && <p style={{padding:"15px"}}>Image Preview</p>}
                    <input style={{paddingTop:"30px"}} type="file" onChange={onImageSelected}/>
                </div>
                <p>Name (Required):</p>
                <div className="create-drink-row">
                    <input type="text" name="name" placeholder="Manhattan" value={inputs.name || ""} onChange={handleFormChange} />
                </div>
                <div className="create-drink-row">
                    {uuid && <p>{'UUID: ' + uuid}</p>}
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
                <p>Menu Description:</p>
                <div className="create-drink-row">
                    <textarea name="menu_desc" rows="6" cols="45" placeholder='150 character maximum' maxLength={150} value={inputs.menu_desc || ""} onChange={handleFormChange} />
                </div>
                <p>Instructions:</p>
                <div className="create-drink-row">
                    <textarea name="instructions" rows="6" cols="45" value={inputs.instructions || ""} onChange={handleFormChange} />
                </div>
                <p>Story:</p>
                <div className="create-drink-row">
                    <textarea name="description" rows="6" cols="45" value={inputs.description || ""} onChange={handleFormChange} />
                </div>
                <p>Footnotes:</p>
                <div className="create-drink-row">
                    <textarea name="footnotes" rows="3" cols="45" value={inputs.footnotes || ""} onChange={handleFormChange} />
                </div>
                <p>Override Drink Volume (oz):</p>
                <div className="create-drink-row">
                    <input type="text" name="override_volume" placeholder="4" value={inputs.override_volume || ""} onChange={handleFormChange} />
                </div>
                <p style={{marginTop: "50px", marginBottom: "10px"}}>Tags (Required):</p>
                <div className="create-drink-row">
                    <TagEntryContainer inputs={inputs} setInputs={setInputs}/>
                </div>
                <div className="create-drink-row">
                    <button onClick={()=>{uuid === undefined ? createDrink(false):updateDrink()}}>{uuid === undefined ? 'Add New Drink':'Update Drink'}</button>
                </div>
            </div>}
        </div>
    )
}

export default CreateDrink;