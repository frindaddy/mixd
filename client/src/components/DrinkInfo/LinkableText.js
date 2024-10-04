import React, {useEffect, useState} from "react"



const LinkableText = ({className, rawBodyText}) => {
    const [bodyText, setBodyText] = useState([rawBodyText]);
    const [allLinks, setAllLinks] = useState([]);

    useEffect(() => {
        let links = rawBodyText.match(/\<.+?\>\{.{36}\}/g).map((link)=>{
            return link.substring(1, link.length-1).split('>{')
        })

        let remainingBody = rawBodyText.split(/\<.+?\>\{.{36}\}/)
        let newBody = []
        for (let i = 0; i < links.length+remainingBody.length; i++) {
            if(i % 2 === 0){
                newBody.push(remainingBody[i/2])
            } else {
                newBody.push(links[(i-1)/2][0])
            }
        }
        setAllLinks(links);
        setBodyText(newBody);
    }, []);

    function linkTo(drinkID) {
        console.log(drinkID)
    }

    return (
        <div className={className}>
            {bodyText.map((line, index)=>{
                return <span style={index % 2 === 1 ? {cursor: 'pointer', 'font-style': 'italic'}:{}} onClick={()=>{linkTo(allLinks[(index-1)/2][1])}}>{line}</span>
            })}
        </div>
    )
}

export default LinkableText;