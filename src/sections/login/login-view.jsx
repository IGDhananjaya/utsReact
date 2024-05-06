import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Paper, Input, Button, Select, MenuItem, TextField, InputLabel, Typography, FormControl } from '@mui/material';

export default function UserEditForm({ nim }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titleIssues, setTitleIssues] = useState('');
  const [descriptionIssues, setDescriptionIssues] = useState('');
  const [issueRating, setIssueRating] = useState('');
  const [division, setDivision] = useState('');
  const [priority, setPriority] = useState('');
  const [image, setImage] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [divisionsData, setDivisionsData] = useState([]);
  const [prioritiesData, setPrioritiesData] = useState([]);

  useEffect(() => {
    // Fetch the issue details
    const fetchIssueDetails = async () => {
      try {
        const response = await axios.get(`https://simobile.singapoly.com/api/trpl/customer-service/${nim}/${id}`);
        const { title_issues, description_issues, rating, id_division_target, id_priority } = response.data;
        setTitleIssues(title_issues);
        setDescriptionIssues(description_issues);
        setIssueRating(rating);
        setDivision(id_division_target);
        setPriority(id_priority);
      } catch (error) {
        console.error('Error fetching issue details:', error);
        setFetchError(error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchIssueDetails();

    // Fetch dropdown data
    const fetchDropdownData = async () => {
      try {
        const divisionResponse = await axios.get('https://simobile.singapoly.com/api/division-department');
        setDivisionsData(divisionResponse.data.datas);

        const priorityResponse = await axios.get('https://simobile.singapoly.com/api/priority-issues');
        setPrioritiesData(priorityResponse.data.datas);
      } catch (error) {
        setFetchError(error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDropdownData();
  }, [id, nim]);

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleFileChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title_issues', titleIssues);
    formData.append('description_issues', descriptionIssues);
    formData.append('rating', issueRating);
    formData.append('id_division_target', division);
    formData.append('id_priority', priority);
    formData.append('image', image);

    try {
      const response = await axios.put(`https://simobile.singapoly.com/api/trpl/customer-service/${nim}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Data saved:', response.data);
      alert('Data has been saved successfully!');
      navigate('/user');
      resetForm();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const resetForm = () => {
    setTitleIssues('');
    setDescriptionIssues('');
    setIssueRating('');
    setDivision('');
    setPriority('');
    setImage(null);
  };

  if (loadingData) {
    return <div>Loading...</div>;
  }

  if (fetchError) {
    return <div>Error: {fetchError.message}</div>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Typography variant="h6" gutterBottom>
          Edit Issue Form
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
          value={issueRating}
          onChange={handleChange(setIssueRating)}
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
            {divisionsData.map((div) => (
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
            {prioritiesData.map((pri) => (
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
          Save Changes
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

UserEditForm.propTypes = {
  nim: PropTypes.string.isRequired,
};
