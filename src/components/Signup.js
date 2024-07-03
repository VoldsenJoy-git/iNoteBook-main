import React from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"",email:"",password:"",cpassword:""})
    let history = useHistory();

    const handleSubmit=async(e)=>
  {
      e.preventDefault();
      const {name,email,password}=credentials;
      const response = await fetch("http://192.168.35.29:5000/api/auth/createuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'          
        },
        body: JSON.stringify({name,email,password})
      });
      const json = await response.json();
      console.log(json)
        // Save the auth token and redirect
        if(json.success)
        {
            localStorage.setItem('token',json.authToken);
            history.push("/");
            props.showAlert("Account Created Successfully","success")
        }
        else{
            props.showAlert("Invalid Details","danger")
        }

  }
    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }




  return (
    <div className='container my-3'>
      <h2>Create an account to use iNotebook</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" name='name' onChange={onChange} aria-describedby="nameHelp"/>
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp"/>
                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" name='password' onChange={onChange} minLength={5} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                <input type="password" className="form-control" id="cpassword"  names='cpassword' onChange={onChange} minLength={5} required/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}

export default Signup