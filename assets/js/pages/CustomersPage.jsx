import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import CustomersApi from '../services/customersAPI';



const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')

    // Recupere les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersApi.findAll()
            setCustomers(data)
        } catch (error) {
            console.log(error.response)
        }  
    } 

    // Au chargement du component declenche le fetch des customers
    useEffect(() => {
        fetchCustomers()
    }, [])

    // supprime un customer
    const handleDelete = async (id)  => {
        const originalCustomers = [...customers]

        setCustomers(customers.filter(customer => customer.id !== id))

        try {
            await CustomersApi.delete(id)
        } catch (error) {
            setCustomers(originalCustomers)
            console.log(error)
        }
    }

    // changement de page
    const handlePageChange = page => setCurrentPage(page)

    // gestion de la recherche des customers
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value)
        setCurrentPage(1)
    }
    const itemsPerPage = 8
    
    // Filtre les customers en fonction de la recherche
    const filteredCustomers = customers.filter(
        customer => 
            customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            customer.email.toLowerCase().includes(search.toLowerCase()) ||
            customer.company.toLowerCase().includes(search.toLowerCase())        
    )

    // Pagination des customers
    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage)

    return <>
        <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des clients</h1>
            <Link to="/customers/new" className="btn btn-primary">Créer un client</Link>

        </div>

        <div className="form-group">
            <input type="text"
                className="form-control"
                placeholder="Rechercher ..."
                onChange={handleSearch}
                value={search}
            />
        </div>

        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montal total</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                { 
                    paginatedCustomers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>
                                    <a href="#">{customer.firstName} {customer.lastName}</a>
                                </td>
                                <td>{customer.email}</td>
                                <td>{customer.company}</td>
                                <td className="text-center">
                                    <span className="badge badge-primary">{customer.invoices.length}</span>
                                </td>
                                <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                                <td>
                                    <button 
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={customer.invoices.length > 1} 
                                    className="btn btn-sm btn-danger">Supprimer</button>
                                </td>
                            </tr>
                        )
                    )
                }
            </tbody>
        </table>
        {itemsPerPage < filteredCustomers.length && <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            length={filteredCustomers.length}
            onPageChanged={handlePageChange}
        />}
    </>;
}

export default CustomersPage;