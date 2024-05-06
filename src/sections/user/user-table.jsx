import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import {
    Card,
    Table,
    Popover,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    TableHead,
    CardHeader,
    IconButton,
    TableContainer,
} from '@mui/material';

import Iconify from 'src/components/iconify';

export default function UserTable({ title, list, onDelete }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentTask, setCurrentTask] = useState(null);

    const navigate = useNavigate();

    const handleClickMenu = (event, task) => {
        setAnchorEl(event.currentTarget);
        setCurrentTask(task);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setCurrentTask(null);
    };

    // const handleEdit = () => {
    //     // Tambahkan fungsi untuk mengedit data di sini
    //     console.log(`Edit task: ${currentTask.id}`);
    //     handleCloseMenu();
    // };

    const handleEdit = (id) => {
        navigate(`/blog/edit/${id}`); // Assuming `/blog/edit` is the route for editing, replace it with the correct route
        handleCloseMenu(); // Make sure to close the menu after navigation
    };

    const handleDelete = () => {
        if (currentTask && onDelete) {
            onDelete(currentTask.nim, currentTask.id);
            console.log(`Delete task: ${currentTask.id}`);
        }
        handleCloseMenu();
    };

    return (
        <Card>
            <CardHeader title={title} />

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>NIM</TableCell>
                            <TableCell>Title Issues</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((task, index) => (
                            <TableRow key={task.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{task.nim}</TableCell>
                                <TableCell>{task.titleIssues}</TableCell>
                                <TableCell>{task.rating}</TableCell>
                                <TableCell>
                                    <IconButton onClick={(event) => handleClickMenu(event, task)}>
                                        <Iconify icon="eva:more-vertical-fill" />
                                    </IconButton>

                                    <Popover
                                        open={Boolean(anchorEl)}
                                        anchorEl={anchorEl}
                                        onClose={handleCloseMenu}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    >
                                        <MenuItem onClick={handleEdit}>
                                            <Iconify icon="solar:pen-bold" sx={{ mr: 2 }} />
                                            Edit
                                        </MenuItem>
                                        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                                            <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 2 }} />
                                            Delete
                                        </MenuItem>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}

UserTable.propTypes = {
    list: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    onDelete: PropTypes.func, // Tambahkan prop onDelete
};