import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import InvoicesApi from '../services/invoicesAPI';

import moment from 'moment';
import { toast } from 'react-toastify';
import TableLoader from '../components/loader/TableLoader';

const STATUS_CLASSES = {
    PAID: 'success',
    SENT: 'info',
    CANCELLED: 'danger'
}

const STATUS_LABELS = {
    PAID: 'Payée',
    SENT: 'Envoyée',
    CANCELLED: 'Annulée'
}

const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    // Recupere les Invoices
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesApi.findAll()
            setInvoices(data)
            setLoading(false)
        } catch (error) {
            console.log(error.response)
            toast.error("Une erreur est survenue lors du chargement des factures.")
        }
    }

    // Au chargement du component declenche le fetch des Invoices
    useEffect(() => {
        fetchInvoices()
    }, [])

    const formatDate = (str) => moment(str).format('DD/MM/YYYY')

    // supprime une invoice
    const handleDelete = async (id) => {
        const originalInvoices = [...invoices]

        setInvoices(invoices.filter(invoice => invoice.id !== id))

        try {
            await InvoicesApi.delete(id)
            toast.success("La suppression de la facture bien été effectuée.")
        } catch (error) {
            setInvoices(originalInvoices)
            console.log(error)
            toast.error("Une erreur est survenue lors de la suppression de la facture.")
        }
    }

    // changement de page
    const handlePageChange = page => setCurrentPage(page)

    // gestion de la recherche des Invoices
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value)
        setCurrentPage(1)
    }
    const itemsPerPage = 8

    // Filtre les Invoices en fonction de la recherche
    const filteredInvoices = invoices.filter(
        invoice => 
            invoice.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            invoice.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            invoice.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[invoice.status].toLowerCase().includes(search.toLowerCase())
    )


    // Pagination des Invoices
    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage)

    return <>
        <div className="d-flex justify-content-between align-items-center">
            <h1>Liste des factures</h1>
            <Link to="/invoices/new" className="btn btn-primary">Créer une facture</Link>

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
                    <th className="text-center">Numero de facture</th>
                    <th className="text-center">Client</th>
                    <th className="text-center">Montant</th>
                    <th className="text-center">Date d'envoi</th>
                    <th className="text-center">Statut</th>
                    <th></th>
                </tr>
            </thead>

            {!loading && <tbody>
                {
                    paginatedInvoices.map(invoice => (
                        <tr key={invoice.id}>
                            <td className="text-center">{invoice.chrono}</td>
                            <td className="text-center">
                                <Link to={"/invoices/" + invoice.id }>
                                    {invoice.customer.firstName} {invoice.customer.lastName}
                                </Link>
                            </td>
                            <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                            <td className="text-center">{formatDate(invoice.sentAt )}</td>
                            <td className="text-center">
                                <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                            </td>
                            <td className="text-center"></td>
                            <td>
                                <Link
                                    to={"/invoices/" + invoice.id }
                                    className="btn btn-sm btn-primary mr-1">Editer
                                </Link>

                                <button
                                    onClick={() => handleDelete(invoice.id)}
                                    className="btn btn-sm btn-danger">Supprimer
                                </button>
                            </td>
                        </tr>
                    )
                    )
                }
            </tbody> }
        </table>
        {loading && <TableLoader />}
        {itemsPerPage < filteredInvoices.length && <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            length={filteredInvoices.length}
            onPageChanged={handlePageChange}
        />}
    </>;
}

export default InvoicesPage;