import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import CustomersApi from '../services/customersAPI';
import { toast } from 'react-toastify';
import TableLoader from '../components/loader/TableLoader'



const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    // Recupere les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersApi.findAll()
            console.log(data)
            setCustomers(data)
            setLoading(false)
        } catch (error) {
            console.log(error.response)
            toast.error("Une erreur est survenue lors du chargement des clients.")
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
            toast.success("La suppression du client a bien été effectuée.")
        } catch (error) {
            setCustomers(originalCustomers)
            console.log(error)
            toast.error("Une erreur est survenue lors de la suppression du client.")
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

            {!loading && <tbody>
                { 
                    paginatedCustomers.map(customer => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>
                                    <Link to={"/customers/" +  customer.id }>
                                        {customer.firstName} {customer.lastName}
                                    </Link>
                                </td>
                                <td>{customer.email}</td>
                                <td>{customer.company}</td>
                                <td className="text-center">
                                    <span className="badge badge-primary">{customer.invoices.length}</span>
                                </td>
                                <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                                <td>
                                    <Link
                                        to={"/customers/" + customer.id }
                                        className="btn btn-sm btn-primary mr-1">Editer
                                    </Link>
                                    <button 
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={customer.invoices.length > 1} 
                                    className="btn btn-sm btn-danger">Supprimer</button>
                                </td>
                            </tr>
                        )
                    )
                }
            </tbody> }
        </table> 
        { loading && <TableLoader /> }
        {itemsPerPage < filteredCustomers.length && <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            length={filteredCustomers.length}
            onPageChanged={handlePageChange}
        />}
    </>;
}

export default CustomersPage;