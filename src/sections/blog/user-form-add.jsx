import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import {
    Paper,
    Input,
    Button,
    Select,
    MenuItem,
    TextField,
    InputLabel,
    Typography,
    FormControl,
} from '@mui/material';

export default function UserFormAdd({ divisions, priorities, nim }) {
    // State untuk menyimpan input form
    const [titleIssues, setTitleIssues] = useState('');
    const [descriptionIssues, setDescriptionIssues] = useState('');
    const [rating, setRating] = useState('');
    const [division, setDivision] = useState('');
    const [priority, setPriority] = useState('');
    const [image, setImage] = useState(null);

    // Buat fungsi navigate
    const navigate = useNavigate();

    // Fungsi untuk menangani perubahan input
    const handleChange = (setter) => (event) => {
        setter(event.target.value);
    };

    // Fungsi untuk menangani perubahan file input
    const handleFileChange = (event) => {
        setImage(event.target.files[0]);
    };

    // Fungsi untuk mengajukan form
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Siapkan data untuk diajukan dalam FormData
        const formData = new FormData();
        formData.append('title_issues', titleIssues);
        formData.append('description_issues', descriptionIssues);
        formData.append('rating', rating);
        formData.append('id_division_target', division);
        formData.append('id_priority', priority);
        formData.append('image', image);

        try {
            // Ajukan data melalui API
            const response = await axios.post(`https://simobile.singapoly.com/api/trpl/customer-service/${nim}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Data added:', response.data);
            // Menampilkan konfirmasi
            alert('Data telah tersimpan dengan sukses!');

            // Tambahkan navigasi ke URL /user
            navigate('/user');

            // Tambahkan tindakan setelah berhasil menambahkan data
            resetForm();
        } catch (err) {
            console.error('Error adding data:', err);
        }
    };

    // Fungsi untuk membersihkan form
    const resetForm = () => {
        setTitleIssues('');
        setDescriptionIssues('');
        setRating('');
        setDivision('');
        setPriority('');
        setImage(null);
    };

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Typography variant="h6" gutterBottom>
                    Form Create Issues
                </Typography>

                <TextField
                    label="Title Issues"
                    value={titleIssues}
                    onChange={handleChange(setTitleIssues)}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Description Issues"
                    value={descriptionIssues}
                    onChange={handleChange(setDescriptionIssues)}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    required
                />

                <TextField
                    label="Rating"
                    value={rating}
                    onChange={handleChange(setRating)}
                    type="number"
                    fullWidth
                    margin="normal"
                    required
                />

                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Division</InputLabel>
                    <Select
                        value={division}
                        onChange={handleChange(setDivision)}
                    >
                        {divisions.map((div) => (
                            <MenuItem key={div.id_division_target} value={div.id_division_target}>
                                {div.division_department_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Priority</InputLabel>
                    <Select
                        value={priority}
                        onChange={handleChange(setPriority)}
                    >
                        {priorities.map((pri) => (
                            <MenuItem key={pri.id_priority} value={pri.id_priority}>
                                {pri.priority_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Input
                    type="file"
                    onChange={handleFileChange}
                    fullWidth
                    margin="normal"
                    required
                />

                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ mt: 2 }}
                >
                    Submit
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={resetForm}
                    sx={{ mt: 2, ml: 2 }}
                >
                    Reset
                </Button>
            </form>
        </Paper>
    );
}

UserFormAdd.propTypes = {
    divisions: PropTypes.array.isRequired,
    priorities: PropTypes.array.isRequired,
    nim: PropTypes.string.isRequired, // Pastikan nim diberikan sebagai prop
};