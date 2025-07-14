import {useState} from "react";
import {Navigate, Link} from 'react-router-dom';
import '../styles/login.css'


function Register() {

    const API_URL = `${import.meta.env.VITE_API_USER_URL}`

    console.log('da register: '+ API_URL);

    const [registerForm, setRegisterForm]=useState({
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        loading: false,
        error: ''
    })

    const [redirect, setRedirect]=useState(false)

    const handleChange = (e) => {
        const {name, value} = e.target
        setRegisterForm({...registerForm, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setRegisterForm({...registerForm, loading:true})

        if(registerForm.password !== registerForm.password_confirmation){
            setRegisterForm({...registerForm, loading:false, error: 'le due password non corrispondono'})
            return;
        }

        try{
           const response = await fetch(`${API_URL}/registrazione`, {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({username: registerForm.username, email: registerForm.email, password: registerForm.password})
           })


            const data = await response.json();

           if(response.status >= 400 && response.status < 600){
               setRegisterForm({...registerForm, loading:false, error: data.message})
           }else{
               setRegisterForm({...registerForm, loading:true, error: 'none'})
               setTimeout(() => setRedirect(true), 2000)
           }


        }catch(err){
            setRegisterForm({...registerForm, loading:false, error: 'errore nel server'})
        }

    }


    return(
        <>
            <div className='login'>
                <h1>Registrazione</h1>
                 <form onSubmit={handleSubmit}>
                    <label>Username</label>
                    <input name='username' type='text' placeholder='Username' value={registerForm.username} onChange={handleChange} required></input>
                    <label>E-mail</label>
                    <input name='email' type='email' placeholder='Email' value={registerForm.email} onChange={handleChange} required></input>
                    <label>Password</label>
                    <input name='password' type='password' placeholder='Password' value={registerForm.password} onChange={handleChange} required></input>
                    <label>Ripeti password</label>
                    <input name='password_confirmation' type='password' placeholder='Ripeti password' value={registerForm.password_confirmation} onChange={handleChange} required></input>

                    <button type='submit' disabled={registerForm.loading}>{!registerForm.loading? 'Registrati':'Attendi'}</button>
                     {registerForm.error === 'none' && <div className='success'>Utente registrato correttamente!</div>}
                     {redirect && <Navigate to='/login' />}
                     {registerForm.error === ''||'none'? null: <div className='error'>{registerForm.error}</div>}

                </form>
                <div className='redirect-link'> <Link to='/login'>Hai già un account? Accedi</Link></div>
            </div>
        </>

    )
}

export default Register