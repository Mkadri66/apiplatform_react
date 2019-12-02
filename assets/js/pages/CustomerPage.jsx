import React, { useState, useEffect } from 'react';
import Field from '../components/form/Field';
import { Link } from 'react-router-dom';
import CustomersAPI from '../services/customersAPI'
import customersAPI from '../services/customersAPI';

const CustomerPage = ({match, history}) => {

    // verifie si il y a un id
    const {id ="new"} = match.params

    const [customer, setCustomer] = useState({
        lastName:"",
        firstName:"",
        email: "",
        company: ""
    })

    const [errors, setErrors] = useState({
        lastName:"",
        firstName:"",
        email: "",
        company: ""
    })
    
    const [editing, setEditing] = useState(false)

    // Recuperer le customer à modifier
    const fetchCustomer = async (id) => {
        try {
            const {lastName, firstName, email, company }= await CustomersAPI.find(id)
            // mise à jour du state
            setCustomer({lastName, firstName, email, company})
        } catch(error){
            history.replace('/customers')
        }
    }

    useEffect(() => {
        // si on est en mode modification, on recupere le customer 
        if(id !== "new"){
            setEditing(true)
            fetchCustomer(id)
        }
    }, [id])
    

    // Gestion des changements dans les formulaires
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget

        setCustomer({...customer, [name]: value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        try{
            if(editing){
                await customersAPI.update(id, customer)
            } else {
                await customersAPI.create(customer)
                // on redirige vers la page customers
                history.replace("/customers")
            }
            setErrors({})
        } catch ({response}){
            const {violations} = response.data
            if(violations){
                const apiErrors = {}
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                })
                setErrors(apiErrors)
            }
            
        }
    }

    return ( 
        <>
            {!editing && <h1>Création d'un client</h1> || <h1>Modification du client </h1>}
            <form onSubmit={handleSubmit}>
                <Field 
                    name="lastName"
                    label="Nom de famille"
                    value={customer.lastName}
                    onChange={handleChange}
                    placeholder="Nom du client"
                    error={errors.lastName}
                />
                <Field 
                    name="firstName"
                    label="Prénom"
                    value={customer.firstName}
                    onChange={handleChange}
                    placeholder="Prénom du client"
                    error={errors.firstName}
                />
                <Field 
                    name="email"
                    label="Mail"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    placeholder="Email du client"
                    error={errors.email}
                />
                <Field 
                    name="company"
                    label="Entreprise"
                    value={customer.company}
                    onChange={handleChange}
                    placeholder="Entreprise du client"
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Enregistrer</button>
                    <Link to="/customers" className="ml-4">Retour à la liste</Link>
                </div>
            </form>
        </>
    );
}

export default CustomerPage;