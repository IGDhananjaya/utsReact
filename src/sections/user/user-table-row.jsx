import { useState } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

export default function UserTableRow({ data, selected, handleDelete, handleClick }) {
    const { id_customer_service, nim, title_issues, description_issues, rating, image_url, division_department_name, priority_name } = data;
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
                <TableCell padding="checkbox">
                    <Checkbox disableRipple checked={selected} onChange={handleClick} />
                </TableCell>
                <TableCell component="th" scope="row" padding="none">
                    <Typography variant="subtitle2" noWrap>
                        {nim}
                    </Typography>
                </TableCell>
                <TableCell>{title_issues}</TableCell>
                <TableCell>{description_issues}</TableCell>
                <TableCell>{rating}</TableCell>
                <TableCell>
                    <Avatar alt="Image" src={image_url} sx={{ width: 50, height: 50 }} />
                </TableCell>
                <TableCell>{division_department_name}</TableCell>
                <TableCell>{priority_name}</TableCell>
                <TableCell align="right">
                    <IconButton onClick={handleOpenMenu}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>
            <Popover
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: { width: 140 },
                }}
            >
                <MenuItem onClick={handleCloseMenu}>
                    <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={() => handleDelete(id_customer_service)} sx={{ color: 'error.main' }}>
                    <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
                    Delete
                </MenuItem>
            </Popover>
        </>
    );
}

UserTableRow.propTypes = {
    data: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    handleDelete: PropTypes.func.isRequired,
    handleClick: PropTypes.func.isRequired,
};
