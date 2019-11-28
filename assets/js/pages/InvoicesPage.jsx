import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesApi from '../services/invoicesAPI';

import moment from 'moment';

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

    // Recupere les Invoices
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesApi.findAll()
            setInvoices(data)
        } catch (error) {
            console.log(error.response)
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
        } catch (error) {
            setInvoices(originalInvoices)
            console.log(error)
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
        <h1>Liste des factures</h1>

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

            <tbody>
                {
                    paginatedInvoices.map(invoice => (
                        <tr key={invoice.id}>
                            <td className="text-center">{invoice.chrono}</td>
                            <td className="text-center">
                                <a href="#">{invoice.customer.firstName} {invoice.customer.lastName}</a>
                            </td>
                            <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                            <td className="text-center">{formatDate(invoice.sentAt )}</td>
                            <td className="text-center">
                                <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                            </td>
                            <td className="text-center"></td>
                            <td>
                                <button
                                    onClick={() => handleDelete(invoice.id)}
                                    // disabled={customer.invoices.length > 1}
                                    className="btn btn-sm btn-primary mr-1">Editer
                                </button>
                                <button
                                    onClick={() => handleDelete(invoice.id)}
                                    // disabled={customer.invoices.length > 1}
                                    className="btn btn-sm btn-danger">Supprimer
                                </button>
                            </td>
                        </tr>
                    )
                    )
                }
            </tbody>
        </table>
        {itemsPerPage < filteredInvoices.length && <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            length={filteredInvoices.length}
            onPageChanged={handlePageChange}
        />}
    </>;
}

export default InvoicesPage;