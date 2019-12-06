import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/form/Field';
import Select from '../components/form/Select';

import CustomersApi from '../services/customersAPI';
import InvoicesApi from '../services/invoicesAPI';

const InvoicePage = ({history, match }) => {
    
    const {id = "new"} = match.params

    // States
    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "SENT"
    })
    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: ""
    })
    
    const [customers, setCustomers] = useState([])

    const [isEditing, setEditing] = useState(false)


    // Recupere les customers pour la liste déroulante
    const fetchCustomers = async () => {
        try {
            const data = await CustomersApi.findAll()
            setCustomers(data)

            if(!invoice.customer) setInvoice({...invoice, customer: data[0].id })
        } catch (error) {
            console.log(error.response)
            history.replace("/invoices")
        }  
    } 
    
    // Récupération de la facture à modifier
    const fetchInvoice = async (id) => {
        try {
            const {amount, customer, status} = await InvoicesApi.find(id)
            setInvoice({amount, customer: customer.id, status})
        } catch (error) {
            console.log(error.response)
            history.replace("/invoices")
        }
    }

    // Au chargement récupération des clients de l'utilisateur
    useEffect(() => {
        fetchCustomers()
    }, [])

    // Récupération de l'id de la facture pour l'éditer
    useEffect(() => {
        if(id !== "new"){
            setEditing(true)
            fetchInvoice(id)
        }
    }, [id])

    // Gestion du state en cas de changement dans les champs du formulaires
    const handleChange = ({currentTarget}) => {
        const {name, value} = currentTarget

        setInvoice({...invoice, [name]: value})
    }

    // Gestion de la soumission du formulaire et gestion des erreurs
    const handleSubmit = async(event) => {
        event.preventDefault()
        try {
            if(isEditing){
                const response = await InvoicesApi.update(id, invoice)
            } else{
                const data = await InvoicesApi.create(invoice)
                history.replace("/invoices")
            }
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
    {!isEditing && <h1>Création d'une facture</h1> || <h1> Modification de la facture </h1>} 
        <form onSubmit={handleSubmit}>
            <Field 
                name="amount" 
                label="Montant"   
                value={invoice.amount} 
                onChange={handleChange} 
                placeholder="Montant de la facture" 
                type="number" 
                error={errors.amount}
            />
            <Select
                name="customer"
                label="Client"
                id="customer"
                onChange={handleChange}
                value={invoice.customer}
                error={errors.customer}
            >
                {customers && customers.map((customer) => 
                    <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>
                )
                }
            </Select>
            <Select
                name="status"
                label="Statut"
                id="status"
                onChange={handleChange}
                value={invoice.status}
                error={errors.status}
            >
                <option value="SENT">Envoyée</option>
                <option value="PAID">Payée</option>
                <option value="CANCELLED">Annulée</option>
            </Select>
            <div className="form-group">
                <button type="submit" className="btn btn-primary">Enregistrer</button>
                <Link to="/invoices" className="ml-4">Retour à la liste</Link>
            </div>
        </form>
    </>
    );
}

export default InvoicePage;