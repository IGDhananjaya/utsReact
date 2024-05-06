import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react'; // Import useNavigate untuk navigasi

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination'; // Import Button

import UserTable from '../user-table'; // Import UserTable

export default function UserView() {
    const [customerServices, setCustomerServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // Menggunakan useNavigate untuk mengarahkan pengguna ke URL tertentu
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCustomerServices = async () => {
            try {
                const response = await axios.get('https://simobile.singapoly.com/api/trpl/customer-service');
                setCustomerServices(response.data.datas);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerServices();
    }, []);

    // Fungsi untuk menghapus data dengan konfirmasi
    const deleteCustomerService = async (nim, idCustomerService) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            try {
                await axios.delete(`https://simobile.singapoly.com/api/trpl/customer-service/${nim}/${idCustomerService}`);
                // Setelah penghapusan berhasil, perbarui state dengan menghapus data yang dihapus
                setCustomerServices((prevServices) =>
                    prevServices.filter(
                        (service) => service.nim !== nim || service.id_customer_service !== idCustomerService
                    )
                );
            } catch (err) {
                console.error('Error deleting customer service:', err);
            }
        }
    };

    // Fungsi untuk menangani klik pada tombol "Create Issues"
    const handleCreateIssuesClick = () => {
        navigate('/blog'); // Mengarahkan ke '/blog'
    };

    // Calculate the data to be displayed on the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = customerServices.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 5 }}>
                Menu Customer Service
            </Typography>

            {/* Tombol "Create Issues" */}
            <Button
                variant="contained"
                color="primary"
                onClick={handleCreateIssuesClick} // Fungsi handler pada klik
                sx={{ marginBottom: 2 }}
            >
                Create Issues
            </Button>

            <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={12}>
                    <UserTable
                        title="List Customer Service"
                        list={currentItems.map((service) => ({
                            id: service.id_customer_service,
                            nim: service.nim,
                            titleIssues: service.title_issues,
                            rating: service.rating,
                        }))}
                        onDelete={deleteCustomerService} // Berikan prop onDelete ke UserTable
                    />
                </Grid>
            </Grid>

            <Pagination
                count={Math.ceil(customerServices.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{ marginTop: 2 }}
            />
        </Container>
    );
}