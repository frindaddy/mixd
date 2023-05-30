import React, { useState } from "react"
import {FaChevronLeft} from "react-icons/fa";
import axios from "axios";
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

    const handleChange = (event) => {
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
                <input type="text" name="name" value={inputs.name || ""} onChange={handleChange} />
                <input type="text" name="abv" value={inputs.abv || ""} onChange={handleChange} />
                <select name="glass" onChange={onImageSelected}>
                    <option value='glass1'>Glass 1</option>
                    <option value='glass2'>Glass 2</option>
                </select>

                <button onClick={createDrink}>Add New Drink</button>
            </div>
        </div>
    )
}

export default CreateDrink;