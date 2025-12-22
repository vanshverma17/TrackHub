
import SignUp from "./SignUp";
import {Link} from "react-router-dom";

const SignIn = () => {
    return (
        <>
        <div>
            <h1>Sign In Page</h1>
            <Link to={'/signup'}>
                <button>SignUp</button>
             </Link>
        </div>
        </>
    );
}

export default SignIn;