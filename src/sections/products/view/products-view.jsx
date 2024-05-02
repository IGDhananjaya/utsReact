import axios from 'axios';
import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import ProductsCard from '../product-card';

export default function ProductsView() {
    const [priorities, setPriorities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPriorities = async () => {
            try {
                const response = await axios.get('https://simobile.singapoly.com/api/division-department');
                // Mengambil division_target selain division_department_name dari respons API
                setPriorities(response.data.datas.map(data => ({
                    id: data.id_division_target,
                    name: data.division_department_name,
                    target: data.division_target,
                })));
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPriorities();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" sx={{ mb: 5 }}>
                Menu Master Data Department
            </Typography>
            <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={12}>
                    <ProductsCard
                        title="List Department"
                        list={priorities}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}