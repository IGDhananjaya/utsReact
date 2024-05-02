import { useState } from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from 'src/components/iconify';

export default function ProductsCard({ title, list, ...other }) {
    const [selected, setSelected] = useState([]);

    const handleClickComplete = (cardId) => {
        const updatedSelected = selected.includes(cardId)
            ? selected.filter((value) => value !== cardId)
            : [...selected, cardId];
        setSelected(updatedSelected);
    };

    return (
        <Card {...other}>
            <CardHeader title={title} />
            {list.map((card) => (
                <TaskItem
                    key={card.id}
                    task={card}
                    checked={selected.includes(card.id)}
                    onChange={() => handleClickComplete(card.id)}
                />
            ))}
        </Card>
    );
}

ProductsCard.propTypes = {
    list: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
};

function TaskItem({ task, checked, onChange }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                pl: 2,
                pr: 1,
                py: 1,
                borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
                ...(checked && {
                    color: 'text.disabled',
                    textDecoration: 'line-through',
                }),
            }}
        >
            <FormControlLabel
                control={<Checkbox checked={checked} onChange={onChange} />}
                label={`${task.name} - ${task.target}`} // Menampilkan nama departemen dan target
                sx={{ flexGrow: 1, m: 0 }}
            />

            <IconButton onClick={handleClickMenu}>
                <Iconify icon="eva:more-vertical-fill" />
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleCloseMenu}>
                    <Iconify icon="solar:pen-bold" sx={{ mr: 2 }} />
                    Edit
                </MenuItem>

                <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
                    <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>
        </Stack>
    );
}

TaskItem.propTypes = {
    task: PropTypes.object.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};