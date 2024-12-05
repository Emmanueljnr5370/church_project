import { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { Row, Col, Card, CardBody, Button, Input, FormGroup } from "reactstrap";
import { toast }from "react-toastify";
import DataTable from 'react-data-table-component';
import generatePDF from "react-to-pdf";
import Logo from '../assets/images/logos/logo.png';
const TransactionList = () => {
    const [transactionList, setTransactionList] = useState([]);

    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [churchName, setChurchname] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState(new Date);
    let _user = localStorage.getItem('user');
    let user = JSON.parse(_user);
    let _permission = localStorage.getItem('permission');
    let permission = JSON.parse(_permission);
    const targetRef = useRef();

    let filteredItems = transactionList.filter(
        item => {
            let isNameMatch = item?.userName?.toLowerCase().includes(userName?.toLowerCase());
            let isEmailMatch = item?.userEmail?.toLowerCase().includes(userEmail?.toLowerCase());
            let isTypeMatch = item?.type.toLowerCase().includes(type?.toLowerCase());
            let isChurchMatch = item?.church?.toLowerCase().includes(churchName?.toLowerCase());
            let isAmounhMatch = item?.amount?.toLowerCase().includes(amount?.toLowerCase());
            let isDateRangeMatch = true;
            if (startDate) {
                const itemDate = new Date(item?.created);
                const startDateObj = new Date(startDate);
                let endDateObj = new Date();
                if (endDate != '') {
                    endDateObj = new Date(endDate);
                }
                isDateRangeMatch = itemDate >= startDateObj && itemDate <= endDateObj;
                console.log("adonis-", itemDate, "--", startDateObj, "--", endDateObj)
            }

            return (
                isNameMatch &&
                isTypeMatch &&
                isChurchMatch &&
                isAmounhMatch &&
                isDateRangeMatch &&
                isEmailMatch)
        }
    );

    const columns = [
        {
            name: 'User',
            cell: row => (
                <div className="d-flex flex-row align-items-center">
                    <img src={row.avatarUrl} style={{ width: 35, height: 35, objectFit: 'cover', marginRight: 10, borderRadius: '50%' }} alt="userAvatar" />
                    <div className="d-flex flex-column">
                        <div>{row.userName === '' ? 'Not set' : row.userName}</div>
                        <div>{row.userEmail}</div>
                    </div>
                </div>
            )
        },
        {
            name: 'Church Name',
            selector: row => row.church,
            sortable: true,
        },
        {
            name: 'Amount',
            selector: row => (row.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row.type,
            sortable: true,
        },
        {
            name: 'Created',
            selector: row => row.created,
            sortable: true,
        },
    ];

    function convertArrayOfObjectsToCSV(array) {
        let result;
        const columnDelimiter = ',';
        const lineDelimiter = '\n';
        const keys = Object.keys(array[0]);
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        array.forEach(item => {
            let ctr = 0;
            keys.forEach(key => {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];

                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    function downloadCSV(array) {
        const link = document.createElement('a');
        let csv = convertArrayOfObjectsToCSV(array);
        if (csv == null) return;

        const filename = 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = `data:text/csv;charset=utf-8,${csv}`;
        }

        link.setAttribute('href', encodeURI(csv));
        link.setAttribute('download', filename);
        link.click();
    }

    const Export = ({ onExport }) => <Button onClick={e => onExport(e.target.value)}>Export</Button>;

    // const actionsMemo = useMemo(() => <Export onExport={() => downloadCSV(transactionList)} />, []);

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (userEmail || churchName || amount || type || startDate || endDate) {
                setUserEmail('');
                setChurchname('');
                setAmount('');
                setType('');
                setStartDate('')
                setEndDate(new Date);
            }
        };
        return (
            <Row>
                <Col sm={12} md={1}>
                    <FormGroup>
                        {/* <Export onExport={() => downloadCSV(filteredItems)} /> */}
                        <Export onExport={() => generatePDF(targetRef, { filename: 'page.pdf' })} />
                    </FormGroup>
                </Col>
                <Col sm={12} md={3}>
                    <FormGroup>
                        <Input
                            id="exampleEmail"
                            name="name"
                            placeholder="UserName"
                            type="text"
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                <Col sm={12} md={3}>
                    <FormGroup>
                        <Input
                            id="exampleEmail"
                            name="email"
                            placeholder="UserEmail"
                            type="text"
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                <Col sm={12} md={3}>
                    <FormGroup>
                        <Input
                            id="exampleEmail"
                            name="email"
                            placeholder="Church Name"
                            type="text"
                            value={churchName}
                            onChange={(e) => setChurchname(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                <Col sm={12} md={2}>
                    <FormGroup>
                        <Input
                            id="exampleEmail"
                            name="email"
                            placeholder="Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                <Col sm={12} md={3}>
                    <FormGroup>
                        <Input
                            id="exampleSelect"
                            name="select"
                            type="select"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="">
                                Select Type
                            </option>
                            <option value="Offer">
                                Offer
                            </option>
                            <option value="Tithe">
                                Tithe
                            </option>
                            <option value="Project">
                                Project
                            </option>
                        </Input>
                    </FormGroup>
                </Col>
                <Col sm={12} md={3}>
                    <FormGroup>
                        <Input
                            name="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                <Col sm={12} md={3}>
                    <FormGroup>
                        <Input
                            name="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                <Col sm={12} md={3} className="text-center">
                    <FormGroup>
                        <Button onClick={handleClear} className="w-100">Clear</Button>
                    </FormGroup>
                </Col>
            </Row>
        );
    }, [userEmail, churchName, amount, type, transactionList, filteredItems]);


    const getTransaction = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/transaction/get_all_transactions`, { headers })
            .then(function (response) {
                const transactions = [];
                for (let i = 0; i < response.data.transaction.length; i++) {
                    let transaction = {
                        id: i,
                        avatarUrl: response.data.transaction[i]?.userId?.avatarUrl,
                        userEmail: response.data.transaction[i]?.userId?.userEmail,
                        userName: response.data.transaction[i]?.userId?.userName,
                        church: response.data.transaction[i]?.churchId?.churchName,
                        amount: response.data.transaction[i]?.amount,
                        type: response.data.transaction[i]?.type,
                        created: response.data.transaction[i]?.createdDate
                    }

                    transactions.push(transaction);
                }
                setTransactionList(transactions);
            })
            .catch(function (error) {
                toast.error(error);
            });
    }
    const adminGetTransactionList = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        let data = {
            church: permission.church
        }
        await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/transaction/admin_get_transaction_list`, data, { headers })
            .then(function (response) {
                const transactions = [];
                for (let i = 0; i < response.data.transaction.length; i++) {
                    let transaction = {
                        id: i,
                        avatarUrl: response.data.transaction[i]?.userId?.avatarUrl,
                        userEmail: response.data.transaction[i]?.userId?.userEmail,
                        userName: response.data.transaction[i]?.userId?.userName,
                        church: response.data.transaction[i]?.churchId?.churchName,
                        amount: response.data.transaction[i]?.amount,
                        type: response.data.transaction[i]?.type,
                        created: response.data.transaction[i]?.createdDate
                    }

                    transactions.push(transaction);
                }
                setTransactionList(transactions);
            })
            .catch(function (error) {
                toast.error(error);
            });
    }
    useEffect(() => {
        setUserEmail('');
        setChurchname('');
        setAmount('');
        setType('');
        setStartDate('')
        setEndDate('');
        if (user?.role == 'super') {
            getTransaction();
        }
        else {
            adminGetTransactionList();
        }
    }, []);

    useEffect(() => {
        console.log('start date', startDate)
        console.log('end date', endDate)
    }, [startDate, endDate])

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    });
   
    return (
        <>
            <Row>
                <Col>
                    <Card className="transaction-table">
                        <CardBody>
                            <DataTable title="Transactions" subHeader subHeaderComponent={subHeaderComponentMemo} pagination columns={columns} data={filteredItems} defaultSortFieldId={1} />
                            <div ref={targetRef} className="px-3 position-fixed bottom-100 z-0" >
                            {/* <div ref={targetRef} className="px-3" > */}
                                <hr/>
                                <div className="text-center d-flex align-items-center justify-content-between py-5 px-3">
                                    <strong className="ms-2 fs-2">Church Transactions</strong>
                                    <img src={Logo} width={50} className="rounded-5"/>
                                </div>
                                <hr/>
                                <div className="px-3">
                                    <div className="fs-5 fw-bold">Filter Conditions</div>
                                    {userEmail !== '' && (<span className="me-5">User Email: {userEmail}</span>)}
                                    {userName !== '' && (<span className="me-5">User Name: {userName}</span>)}
                                    {churchName !== '' && (<span className="me-5">Church Name: {churchName}</span>)}
                                    {amount !== '' && (<span className="me-5">Amount: {amount}</span>)}
                                    {type !== '' && (<span className="me-5">Type: {type}</span>)}
                                    {startDate !== '' && (<span className="me-5">Start Date: {startDate}</span>)}
                                </div>
                                <hr/>
                                <DataTable columns={columns} data={filteredItems} defaultSortFieldId={1} />
                                <hr/>
                                <div className="text-end fw-bold fs-5 mb-2">Total Amount: {(filteredItems.reduce((accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue['amount']), 0)).toLocaleString()} </div>
                                <div className="text-end fw-bold">{formattedDate}</div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default TransactionList;
