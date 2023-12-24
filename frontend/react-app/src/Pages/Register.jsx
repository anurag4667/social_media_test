import React, { useState } from 'react'
import axios from "axios"
const Register = () => {
    const [name,setname] = useState("");
    const [email,setemail] = useState("");
    const [password,setpassword] = useState("");

    const submithandler =  async (e)=>{
        e.preventDefault();
        console.log(name,email,password);

        const {data} = axios.post("https://node-js-social-media.onrender.com/api/v1/register",{
            name,email,password
        },
        {
            headers: {
                "Content-Type" : "application/json",
            },
            withCredentials : true,
        });

        
    }

  return (
    <div className='register'>
        <form onSubmit={submithandler}>
            NAME :<input type="text" value={name} onChange={(e)=> setname(e.target.value)} required/>
            EMAIL :<input type="email" value={email} onChange={(e)=> setemail(e.target.value)} required/>
            PASSWORD :<input type="password" value={password} onChange={(e)=> setpassword(e.target.value)} required/>
            <button type = "submit">REGISTER</button>
        </form>
    </div>
  )
}

export default Register