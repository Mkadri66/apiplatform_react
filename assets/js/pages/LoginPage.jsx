import React, { useState, useContext } from 'react';
import AuthApi from '../services/authAPI'
import AuthContext from '../contexts/AuthContext'
import Field from '../components/form/Field';

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
                <Field 
                    name="username"
                    label="Adresse mail"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="Entrez votre adresse mail"
                    error={error}
                />
                <Field 
                    name="password"
                    label="Mot de passe"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Votre mot de passe"
                    type="password"
                    error={error}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Valider</button>
                </div>
            </form>
        </>
    );
}

export default LoginPage;