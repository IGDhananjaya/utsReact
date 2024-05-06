import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { Container, Typography } from '@mui/material';

import UserFormAdd from '../user-form-add';

export default function UserViewAdd() {
    const [divisions, setDivisions] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Mendapatkan data untuk dropdown
        const fetchDropdownData = async () => {
            try {
                const divisionResponse = await axios.get('https://simobile.singapoly.com/api/division-department');
                setDivisions(divisionResponse.data.datas);

                const priorityResponse = await axios.get('https://simobile.singapoly.com/api/priority-issues');
                setPriorities(priorityResponse.data.datas);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDropdownData();
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
            Menu Create Issues
            </Typography>

            <UserFormAdd
                divisions={divisions}
                priorities={priorities}
                nim="2255011003" // Sesuai dengan permintaan API
            />
        </Container>
    );
}