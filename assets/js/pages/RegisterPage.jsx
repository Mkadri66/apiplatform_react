import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/form/Field';

import UsersApi from '../services/usersAPI'
import { toast } from 'react-toastify';

const  RegisterPage = ({ history }) => {

    const [user, setUser] = useState({
        lastName: "",
        firstName: "",
        email: "",
        password: "",
        passwordConfirm:""
    })

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        password: "",
        passwordConfirm:""
    })

    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget

        setUser({...user, [name]: value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const apiErrors = {}

        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Les deux mots de passe doivent être identiques."
            toast.error("Il y'a des erreurs dans vos informations.")
            setErrors(apiErrors)
            return
        }

        try {
            const response = await UsersApi.register(user)
            setErrors({})  
            toast.success("Inscription réussie.")
            // En cas de succes on redirige vers la page de connexion
            history.replace("/login")
        } catch ({response}){
            const {violations} = response.data
            if(violations){
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                })
                setErrors(apiErrors)

            }
            toast.error("Il y'a des erreurs dans vos informations.")
        }
    }

    return (
        <>
            <h1>Créer votre compte</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName" 
                    label="Nom"   
                    value={user.lastName} 
                    onChange={handleChange} 
                    placeholder="Votre nom" 
                    type="text" 
                    error={errors.lastName}
                />
                <Field
                    name="firstName" 
                    label="Prénom"   
                    value={user.firstName} 
                    onChange={handleChange} 
                    placeholder="Votre prénom" 
                    type="text" 
                    error={errors.firstName}
                />
                <Field
                    name="email" 
                    label="Email"   
                    value={user.email} 
                    onChange={handleChange} 
                    placeholder="Votre email" 
                    type="email" 
                    error={errors.email}
                />
                <Field
                    name="password" 
                    label="Mot de passe"   
                    value={user.password} 
                    onChange={handleChange} 
                    placeholder="Votre mot de passe" 
                    type="password" 
                    error={errors.password}
                />
                <Field
                    name="passwordConfirm" 
                    label="Confirmer le mot de passe"   
                    value={user.passwordConfirm} 
                    onChange={handleChange} 
                    placeholder="Confirmer le mot de passe" 
                    type="password" 
                    error={errors.passwordConfirm}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Enregistrer</button>
                    <Link to="/login" className="ml-4">J'ai deja un compte</Link>
                </div>
            </form>
        </>
    );
}

export default RegisterPage;