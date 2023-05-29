import React, {useState, useEffect} from "react"
import unknown from "../../images/glassware/unknown.svg";
import coupe from "../../images/glassware/coupe.svg";
import collins from "../../images/glassware/collins.svg";
import rocks from "../../images/glassware/rocks.svg";
const GlassImg = ({glassType}) => {

    const [glassImg, setGlassImg] = useState(unknown);

    useEffect(() => {
        if(glassType){
            switch (glassType.toLowerCase()){
                case 'coupe':
                    setGlassImg(coupe);
                    break;
                case 'collins':
                    setGlassImg(collins);
                    break;
                case 'rocks':
                    setGlassImg(rocks);
                    break;
                default:
                    break;
            }
        }
    }, [glassType]);

    return (
        <img src={glassImg} alt={glassType+' glass'}/>
    )
}

export default GlassImg;