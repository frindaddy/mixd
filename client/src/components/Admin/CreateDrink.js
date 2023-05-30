import React, { useState } from "react"
import {FaChevronLeft} from "react-icons/fa";
import axios from "axios";
const CreateDrink = ({setCurrentPage}) => {
    const [imageUUID, setImageUUID] = useState("null");
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const onImageSelected = (e) => {
        setImagePreview(URL.createObjectURL(e.target.files[0]));
        setSelectedImage(e.target.files[0]);
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
        console.log(data);
        if (data.imageUUID) {
            setImageUUID(data.imageUUID);
        } else {
            //e.target.value = null;
            console.error(data.error);
            //<img style={{width:400}} src={"./api/image?file=user_drinks/"+imageUUID+".jpg&backup=glassware/unknown.svg"} alt='Drink Preview'/>
        }
    }

    const createDrink = () => {
        uploadImage().then(r => {
           console.log('Drink Added!')
        });
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
                {imagePreview && <img style={{width:300}} src={imagePreview} alt='preview'/>}
                <p>Drink Preview</p>
                <input type="file" onChange={onImageSelected}/>
                <button onClick={createDrink}>Add New Drink</button>
            </div>
        </div>
    )
}

export default CreateDrink;