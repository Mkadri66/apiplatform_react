import React, { useState, useContext } from 'react';
import AuthApi from '../services/authAPI'
import AuthContext from '../contexts/AuthContext'

const LoginPage = ({history}) => {

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    })

    const [error, setError] = useState("")

    const {setIsAuthenticated} = useContext(AuthContext)

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget

        setCredentials({...credentials, [name]: value})
    }

    const handleSubmit = async event => {
        event.preventDefault();
        
        try{
            await AuthApi.authenticate(credentials)
            setError("")
            setIsAuthenticated(true)
            history.replace("/customers")

        } catch(error){
            console.log(error.response)
            setError("Aucun compte ne possède cette adresse ou les informations ne correspondent pas.")
        }
    }


    return ( 
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Mail</label>
                    <input 
                            className={"form-control" + (error && " is-invalid")}
                            value={credentials.username}
                            onChange={handleChange}
                            type="text" 
                            placeholder="Adresse email de connexion" 
                            name="username"
                            id="username"/>
                    {error && <p className="invalid-feedback"> {error} </p>}
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input 
                            className="form-control"
                            value={credentials.password}
                            onChange={handleChange}
                            type="password" 
                            placeholder="Votre mot de passe" 
                            name="password"
                            id="password"/>
                    {error && <p className="invalid-feedback"> {error}</p>}
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Valider</button>
                </div>
            </form>
        </>
    );
}

export default LoginPage;