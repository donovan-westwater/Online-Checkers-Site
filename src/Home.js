import {React, useState} from 'react';
import Login from './Login.js';
import Logout from './Logout.js';


function Home(){
    const [logged, setLogin] = useState(false);
    return(
        <div>
            {logged?<Logout func={setLogin}/>:<Login func={setLogin}/>}
        </div>
    );
}

export default Home;