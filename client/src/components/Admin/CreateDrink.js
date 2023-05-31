import React, { useState } from "react"
import {FaAlignCenter, FaChevronLeft} from "react-icons/fa";
import axios from "axios";
import GlassTypes from "./GlassTypes";
import TagEntryContainer from "./TagEntryContainer";
import IngredientEntryContainer from "./IngredientEntryContainer";
const CreateDrink = ({setCurrentPage}) => {
    const noImageURL = './api/image?file=glassware/unknown.svg';
    const [imagePreviewURL, setImagePreviewURL] = useState(noImageURL);
    const [selectedImage, setSelectedImage] = useState(null);
    const [inputs, setInputs] = useState({});
    const [imageUUID, setImageUUID] = useState(null);
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
            //setImageUUID(data.imageUUID);
            //setInputs(values => ({...values, "image": data.imageUUID}))
        } else {
            console.error(data.error);
            return null;
        }
    }

    const handleFormChange = (event) => {
        setInputs(values => ({...values, [event.target.name]: event.target.value}))
    }

    const createDrink = async () => {
        let uuid = imageUUID;
        if (!imageUUID){
            uuid = await uploadImage();
            setImageUUID(uuid);
        }
        if (uuid) {
            alert("POST DATA:\n"+JSON.stringify({...inputs, image:uuid}));
        } else {
            alert('Please add an image!');
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
                        <option value='no_drink' disabled={true} selected={true}>No Glass</option>
                        {GlassTypes.map((glass)=> {
                            return <option value={glass.name}>{glass.displayName}</option>
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
                    <button onClick={createDrink}>Add New Drink</button>
                </div>
            </div>
        </div>
    )
}

export default CreateDrink;