import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Row, Col, Card, CardTitle, CardBody, Badge, Button, Modal, ModalHeader, Input, ModalBody, FormGroup, Label, ModalFooter } from "reactstrap";
import { toast }from "react-toastify";
import ImageUploader from 'react-image-upload'
import 'react-image-upload/dist/index.css'
import { Link } from "react-router-dom";
import DefaultImage from '../assets/images/bg/default.jpg';
import DataTable from 'react-data-table-component';

const ChurchList = () => {
    const [churchId, setChurchId] = useState('');
    const [churchData, setChurchData] = useState([]);
    const [churchName, setChurchName] = useState('');
    const [churchAddress, setChurchAddress] = useState('');
    const [churchImage, setChurchImage] = useState('');


    const [modal, setModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    let _user = localStorage.getItem('user');
    let user = JSON.parse(_user);
    let _permission = localStorage.getItem('permission');
    let permission = JSON.parse(_permission);

    const toggle = () => setModal(!modal);


    const getImageFileObject = (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile.file);

        axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/upload`, formData)
            .then((response) => {
                setChurchImage(response.data.path)
                toast.success(response.data.message)
            })
            .catch((error) => {
                console.error(error);
                toast.error(error)
            });
    }

    const runAfterImageDelete = (file) => {
        console.log({ file })
    }

    const createButton = () => {
        setChurchName('');
        setChurchAddress('');
        setChurchImage('');
        toggle(true)

    }

    const createChurch = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }

        if (churchName === '' || churchAddress === '' || churchImage === '') {
            toast.error('You must input field');
            return
        }

        const newChurch = {
            churchName: churchName,
            churchAddress: churchAddress,
            photoUrl: churchImage,
        };

        await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/church/create_church`,
            newChurch,
            { headers })
            .then(function (response) {
                // setChurchData(response.data.church)
                toggle();
            })
            .catch(function (error) {
                console.log(error)
            });

    }

    const deleteButton = async (id) => {
        setIsOpen(true);
        setChurchId(id);
    }

    const deleteChurch = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/church/delete_church/${churchId}`, { headers })
            .then(function (response) {
                toast.success(response.data.message)
                setIsOpen(false);
            })
            .catch(function (error) {

            });
    }

    const adminGetChurchList = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        let data = {
            church: permission.church
        }
        await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/church/admin_get_church_list`, data, { headers })
            .then(function (response) {
                setChurchData(response.data.church);
            })
            .catch(function (error) {
                toast.error(error);
            });
    }
    const getAllChurch = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/church/all_churches`, { headers })
            .then(function (response) {
                console.log(response.data.church)
                setChurchData(response.data.church);
            })
            .catch(function (error) {
                toast.error(error);
            });
    }

    useEffect(() => {
        if (user?.role === 'super') {
            getAllChurch();
        }
        else {
            adminGetChurchList();
        }
    }, [modal, isOpen]);

    const columns = [
        {
            name: 'Church Name',
            selector: row => row.churchName,
            sortable: true,
        },
        {
            name: 'Church Address',
            selector: row => row.churchAddress,
            sortable: true,
        },
        {
            name: 'Church Image',
            cell: row => (
                <img src={row.photoUrl} style={{ width: 50, height: 50, objectFit: 'cover' }} alt="church_image" />
            )
        },
        {
            name: 'Total Amount(FCFA)',
            selector: row => (row.totalAmount).toLocaleString(),
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status === true ? (<Badge color="info">Active</Badge>) : (<Badge color="danger">Block</Badge>),
            sortable: true,
        },
        {
            name: 'Actions',
            selector: row => (
                <td>
                    <Link to={`/admin/church_list/${row._id}`}><Button color="info" className="ms-3" ><i className='bi bi-pencil-square'></i></Button></Link>
                    {user?.role === 'super' && (<Button color="danger" className="ms-3" onClick={() => deleteButton(row._id)} ><i className='bi bi-trash'></i></Button>)}
                </td>
            )
        },
    ];

    const subHeaderComponent = useMemo(() => {
        return (
            <Row>
                <Col sm={12} md={12} className="mb-2">
                    {user?.role === 'super' && (<Button color="info" onClick={createButton}>Create Church</Button>)}
                </Col>
            </Row>
        )
    });

    return (
        <>
            <Row>
                <Col lg="12">
                    <Card>
                        <CardBody>
                            <DataTable title="Churches" subHeader subHeaderComponent={subHeaderComponent} pagination columns={columns} data={churchData} defaultSortFieldId={1} />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Modal isOpen={modal} toggle={toggle} centered>
                <ModalHeader toggle={toggle}>Create New Church</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm={12} md={12} className="mb-3">
                            <FormGroup>
                                <Label for="exampleEmail">Church Name</Label>
                                <Input
                                    id="exampleEmail"
                                    name="UserName"
                                    value={churchName}
                                    placeholder="Church Name"
                                    type="text"
                                    onChange={(e) => setChurchName(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={12} md={12} className="mb-3">
                            <FormGroup>
                                <Label for="exampleEmail">Church Address</Label>
                                <Input
                                    id="exampleEmail"
                                    name="UserName"
                                    placeholder="Church Address"
                                    type="text"
                                    value={churchAddress}
                                    onChange={(e) => setChurchAddress(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={12} md={12} className="mb-3">
                            <FormGroup>
                                <Label for="exampleEmail">Church Image</Label>
                                <Row>
                                    <Col sm={12} md={6} className="mb-3">{churchImage === '' ? <img src={DefaultImage} className="w-100" alt="detaultImage" /> : <img src={churchImage} className="w-100" alt="churchImage" />}</Col>
                                    <Col sm={12} md={6} className="d-flex align-items-center justify-content-center mb-3">
                                        <ImageUploader
                                            onFileAdded={(img) => getImageFileObject(img)}
                                            onFileRemoved={(img) => runAfterImageDelete(img)}
                                        />
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="info" onClick={createChurch}>Save Church</Button>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={isOpen} toggle={() => setIsOpen(false)} centered='ture'>
                <ModalBody className="text-center">
                    <h4 className="my-3">Are you sure you want to delete the Church from the database?</h4>
                    <Button color="danger" className="ms-3" onClick={deleteChurch}>Yes</Button>
                    <Button color="info" className="ms-3" onClick={() => setIsOpen(false)}>No</Button>
                </ModalBody>
            </Modal>
        </>
    );
};

export default ChurchList;
