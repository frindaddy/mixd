import React, { useState } from "react"
import {FaChevronLeft} from "react-icons/fa";
import axios from "axios";
import GlassTypes from "./GlassTypes";
const CreateDrink = ({setCurrentPage}) => {
    const noImageURL = './api/image?file=glassware/unknown.svg';
    const [imagePreviewURL, setImagePreviewURL] = useState(noImageURL);
    const [selectedImage, setSelectedImage] = useState(null);
    const [inputs, setInputs] = useState({});
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
        const imageUUID = await uploadImage();
        if (imageUUID) {
            alert("POST DATA:\n"+JSON.stringify({...inputs, image:imageUUID}));
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

            <div>
                <img style={{width:300, height: 420, overflow:"hidden"}} src={imagePreviewURL} alt='Drink Preview'/>
                <p>Drink Preview</p>
                <input type="file" onChange={onImageSelected}/>
                <input type="text" name="name" value={inputs.name || ""} onChange={handleFormChange} />
                <input type="text" name="abv" value={inputs.abv || ""} onChange={handleFormChange} />
                <select name="glass" onChange={handleFormChange}>
                    <option value='glass0'>No Glass</option>
                    {GlassTypes.map((glass)=> {
                        return <option value={glass.name}>{glass.displayName}</option>
                    })}
                </select>
                <input type="text" name="garnish" value={inputs.garnish || ""} onChange={handleFormChange} />
                <textarea name="description" value={inputs.description || ""} onChange={handleFormChange} />
                <textarea name="footnotes" value={inputs.footnotes || ""} onChange={handleFormChange} />
                <button onClick={createDrink}>Add New Drink</button>
            </div>
        </div>
    )
}

export default CreateDrink;