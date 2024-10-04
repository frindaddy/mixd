import React, {useEffect, useState} from "react"



const LinkableText = ({className, rawBodyText, setCurrentDrink}) => {
    const [bodyText, setBodyText] = useState([rawBodyText]);
    const [allLinks, setAllLinks] = useState([]);

    useEffect(() => {
        let regexRes = rawBodyText.match(/\<.+?\>\{.{36}\}/g)
        if(regexRes) {
            let links = regexRes.map((link)=>{
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
        } else {
            setBodyText([rawBodyText]);
            setAllLinks([]);
        }
    }, [rawBodyText]);

    function linkTo(index) {
        if(allLinks[index]){
            setCurrentDrink(allLinks[index][1])
        }
    }

    return (
        <div className={className}>
            {bodyText.map((line, index)=>{
                return <span style={index % 2 === 1 ? {cursor: 'pointer', 'text-decoration-line': 'underline'}:{}} onClick={()=>{linkTo((index-1)/2)}}>{line}</span>
            })}
        </div>
    )
}

export default LinkableText;