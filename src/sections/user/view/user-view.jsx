import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
// import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator,  } from '../utils';

export default function UserPage() {

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://simobile.singapoly.com/api/trpl/customer-service/${id}`);
            // Perbarui state setelah penghapusan
            setTableState((prevState) => ({
                ...prevState,
                data: prevState.data.filter(item => item.id_customer_service !== id)
            }));
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        handleStateChange({ selected: newSelected });
    };

    const [tableState, setTableState] = useState({
        data: [],
        page: 0,
        order: 'asc',
        selected: [],
        orderBy: 'name',
        filterName: '',
        rowsPerPage: 5,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://simobile.singapoly.com/api/trpl/customer-service/');
            setTableState((prevState) => ({
                ...prevState,
                data: response.data,
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleStateChange = (newState) => {
        setTableState((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    const { data, page, order, selected, orderBy, filterName, rowsPerPage } = tableState;

    const handleChangePage = (event, newPage) => {
        handleStateChange({ page: newPage });
    };

    const handleChangeRowsPerPage = (event) => {
        handleStateChange({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
    };

    const handleFilterByName = (event) => {
        handleStateChange({ page: 0, filterName: event.target.value });
    };

    const dataFiltered = applyFilter({
        inputData: data,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const notFound = !dataFiltered.length && !!filterName;

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Users</Typography>
                <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
                    New User
                </Button>
            </Stack>

            <Card>
                <UserTableToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <UserTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={data.length}
                                numSelected={selected.length}
                                onRequestSort={(event, property) => handleStateChange({ order: order === 'asc' ? 'desc' : 'asc', orderBy: property })}
                                onSelectAllClick={(event) => handleStateChange({ selected: event.target.checked ? data.map((n) => n.id_customer_service) : [] })}
                                headLabel={[
                                    { id: 'nim', label: 'NIM' },
                                    { id: 'title_issues', label: 'Title Issues' },
                                    { id: 'description_issues', label: 'Description Issues' },
                                    { id: 'rating', label: 'Rating' },
                                    { id: 'image_url', label: 'Image', align: 'center' },
                                    { id: 'division_department_name', label: 'Division Department Name' },
                                    { id: 'priority_name', label: 'Priority Name' },
                                    { id: '', label: '', align: 'right' },
                                ]}
                            />
                            <TableBody>
                                {dataFiltered
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <UserTableRow
                                            key={row.id_customer_service}
                                            data={row}
                                            handleDelete={handleDelete}
                                            selected={selected.indexOf(row.id_customer_service) !== -1}
                                            handleClick={(event) => handleClick(event, row.id_customer_service)}
                                        />
                                    ))}
                                <TableEmptyRows height={77} emptyRows={emptyRows(page, rowsPerPage, data.length)} />
                                {notFound && <TableNoData query={filterName} />}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
                <TablePagination
                    page={page}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Container>
    );
}
