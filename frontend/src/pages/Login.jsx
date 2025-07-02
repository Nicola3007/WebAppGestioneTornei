import {useState} from "react";
import {Navigate, Link} from 'react-router-dom';
import './login.css'



function Login() {

    const API_URL = import.meta.env.VITE_API_BASE_URL;
    console.log(API_URL);

    const [formData, setFormData]=useState({
        email: '',
        password: '',
        error: '',
        loading: false
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]:value})
    }

    const  handleSubmit = async (e) => {

        e.preventDefault(); //per evitare il ricaricamento della pagina

        setFormData({...formData, loading:true}) //imposto il booleano loading a true


        try{
            console.log(API_URL)
            const response = await fetch(`${API_URL}/api/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: formData.email, password: formData.password})
            })

            const data = await response.json()

            if(response.status === 400 || response.status === 500){

                setFormData({...formData, loading:false, error: data.message.toString()})
                console.log(formData.error)

            }else{
                setFormData({...formData, loading:false, error:'none'})
                localStorage.setItem('accessToken', data.accessToken)

            }

        }catch(err){
            setFormData({...formData, loading:false, error: 'errore nel server o nel login'})
        }

    }

    return (
        <div className="login">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>e-mail</label>
                <input name='email' type='email' placeholder='Email' value ={formData.email} onChange={handleChange} required ></input>
                <label>password</label>
                <input name='password' type='password' placeholder='Password' value ={formData.password} onChange={handleChange} required ></input>

                <button type='submit' disabled={formData.loading}>{formData.loading ? 'Attendi' : 'Accedi'}</button>
                {formData.error === 'none'? <Navigate to='/' /> : formData.error === '' ? null: <div className='error'>{formData.error}</div>}
            </form>
            <div className='register'> <Link to='/register'>Non hai un account? Registrati</Link></div>
        </div>
    )
}

export default Login;