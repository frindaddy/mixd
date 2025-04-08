import {Link} from "react-router-dom";
import "../format/Page404.css";

const Page404 = () => {
    return (
        <div className="page404-container">
            <img className="page404-image" src={"/api/image?file=glassware/brokennickandnora.svg"}/>
            <div className="page404-uhoh">Whoops!</div>
            <div className="page404-subtext">Looks like you've mixd up your url</div>
            <Link to="/">Return to main page</Link>
        </div>
    )
};

export default Page404;