import React, {useState, useEffect} from "react"
import coupe from "../../images/glassware/coupe.svg";
import collins from "../../images/glassware/collins.png";
const GlassImg = ({glassType}) => {

    const [glassImg, setGlassImg] = useState(coupe);

    useEffect(() => {
        if(glassType){
            switch (glassType.toLowerCase()){
                case 'coupe':
                    setGlassImg(coupe);
                    break;
                case 'collins':
                    setGlassImg(collins);
                    break;
            }
        }
    });

    return (
        <img src={glassImg} alt={glassType+' glass'}/>
    )
}

export default GlassImg;