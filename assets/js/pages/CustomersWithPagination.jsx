import React, { useState, useEffect } from 'react';
import Pagination from '../components/Pagination'
import axios from 'axios';


const CustomersWithPagination = (props) => {

    const [customers, setCustomers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    
    const itemsPerPage = 8

    useEffect(() => {
        axios.get(`http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then(response => {
                setCustomers(response.data['hydra:member'])
                setTotalItems(response.data['hydra:totalItems'])
                setLoading(false)
            })
            
            .catch(error => console.log(error.response))
    }, [currentPage])

    const handleDelete = (id) => {
        const originalCustomers = [...customers]

        setCustomers(customers.filter(customer => customer.id !== id))

        axios.delete(`http://localhost:8000/api/customers/${id}`)
            .then(response => console.log("ok"))
            .catch(error => {
                // si il y a une erreur on recupere l'ancien state
                setCustomers(originalCustomers)
                console.log(error)
            })
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
        setLoading(true)
    }

    
    const paginatedCustomers = Pagination.getData(customers, currentPage, itemsPerPage)

    return <>
        <h1>Liste des clients (alternative)</h1>

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
                    loading === true && <tr><td>Chargement...</td></tr>
                }
                {!loading && customers.map(customer => (
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
        <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            length={totalItems}
            onPageChanged={handlePageChange}
        />
    </>;
}

export default CustomersWithPagination;