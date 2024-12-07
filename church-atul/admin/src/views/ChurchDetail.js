import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Table, Card, CardTitle, CardBody, CardSubtitle,Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label } from "reactstrap";
import { toast }from "react-toastify";
import { Link, useParams } from "react-router-dom";
import ImageUploader from 'react-image-upload'
import 'react-image-upload/dist/index.css'
import DefaultImage from '../assets/images/bg/default.jpg';


const ChurchDetail = () => {
    let { id } = useParams();

    const [churchName, setChurchName] = useState('');
    const [churchAddress, setChurchAddress] = useState('');
    const [churchImage, setChurchImage] = useState('');
    const [projectData, setProjectData] = useState([]);
    const [status, setStatus] = useState(true);

    const [modal, setModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [projectId, setProjectId] = useState('')
    const [projectName, setProjectName] = useState('');
    const [projectImage, setProjectImage] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

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

    const getProjectImageFileObject = (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile.file);

        axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/upload`, formData)
            .then((response) => {
                setProjectImage(response.data.path)
                toast.success(response.data.message)
            })
            .catch((error) => {
                console.error(error);
                toast.error(error)
            });
    }

    const runAfterProjectImageDelete = (file) => {
        console.log({ file })
    }

    const createProjectButton = () => {
        setProjectId('');
        setProjectName('');
        setProjectImage('');
        setProjectDescription('');
        setModal(true);
    }

    const selectProject = (id, name, image, description) => {
        setProjectId(id);
        setProjectName(name);
        setProjectImage(image);
        setProjectDescription(description);
        toggle(true);
    }

    const createNewProject = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }

        if(projectName === '' || projectDescription === '' || projectImage === '') {
            toast.error('You must input field');
            return
        }

        const newProject = {
            projectName: projectName,
            projectDescription: projectDescription,
            projectPhoto: projectImage,
            donatePrice: 0
        };

        await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/church/create_project`,
            {
                churchId: id,
                projectList: [newProject]
            },
            { headers })
            .then(function (response) {
                setProjectId('');
                setProjectName('');
                setProjectImage('');
                setProjectDescription('');
                toast.success(response.data.message);
                toggle();
            })
            .catch(function (error) {
                console.log(error)
            });


    }

    const updateProject = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }

        if(projectName === '' || projectDescription === '' || projectImage === '') {
            toast.error('You must input field');
            return
        }

        const updateProject = {
            projectName: projectName,
            projectDescription: projectDescription,
            projectPhoto: projectImage,
            donatePrice: 0
        };

        await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/church/update_project`,
            {
                churchId: id,
                projectId: projectId,
                projectData: [updateProject]
            },
            { headers })
            .then(function (response) {
                setProjectId('');
                setProjectName('');
                setProjectImage('');
                setProjectDescription('');
                toast.success(response.data.message);
                toggle();
            })
            .catch(function (error) {
                console.log(error)
            });

    }

    const deleteButton = async (id) => {
        setIsOpen(true);
        setProjectId(id);
    }

    const deleteProject = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/church/${id}/delete_project/${projectId}`, { headers })
            .then(function (response) {
                toast.success(response.data.message)
            })
            .catch(function (error) {

            });
    }

    const updateChurch = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }

        if(churchName === '' || churchAddress === '' || churchImage === '') {
            toast.error('You must input field');
            return
        }

        const data = {
            churchId: id,
            churchName: churchName,
            churchAddress: churchAddress,
            churchImage: churchImage,
            status: status
        }

        await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/church/update_church`,
            data,
            { headers })
            .then(function (response) {
                setChurchName(response.data.church.churchName);
                setChurchAddress(response.data.church.churchAddress);
                setChurchImage(response.data.church.photoUrl);
                setProjectData(response.data.project);
                setStatus(response.data.church.status);
                toast.success(response.data.message);
            })
            .catch(function (error) {
                console.log(error)
            });
    }

    const getChurch = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/church/get_church_detail/${id}`, { headers })
            .then(function (response) {
                setChurchName(response.data.church.churchName);
                setChurchAddress(response.data.church.churchAddress);
                setChurchImage(response.data.church.photoUrl);
                setStatus(response.data.church.status);
                setProjectData(response.data.projects)
            })
            .catch(function (error) {
                toast.error(error)
            });
    }

    useEffect(() => {
        getChurch();
    }, [modal, isOpen]);

    return (
        <>
            <Row>
                <Col sm={12}><Link to="/admin/church_list" className="nav-link"><h4><i className="bi bi-chevron-left"></i>Back</h4></Link></Col>
                <Col lg="12">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Churuch Detail</CardTitle>
                            {/* <CardSubtitle className="mb-2 text-muted" tag="h6">
                                Churuch Detail
                            </CardSubtitle> */}
                            <hr />
                            <Row className="mt-2">
                                <Col sm={12} md={6}>
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
                                <Col sm={12} md={6}>
                                    <FormGroup>
                                        <Label for="exampleEmail">Church Address</Label>
                                        <Input
                                            id="exampleEmail"
                                            name="UserName"
                                            value={churchAddress}
                                            placeholder="Church Name"
                                            type="text"
                                            onChange={(e) => setChurchAddress(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col sm={12} md={6} >
                                    <FormGroup>
                                        <Label for="exampleEmail">Church Image</Label>
                                        <Row>
                                            <Col sm={12} md={6} className="mb-3"><img src={churchImage} className="w-100" alt="churchImage"/></Col>
                                            <Col sm={12} md={6} className="d-flex align-items-center justify-content-center mb-3">
                                                <ImageUploader
                                                    onFileAdded={(img) => getImageFileObject(img)}
                                                    onFileRemoved={(img) => runAfterImageDelete(img)}
                                                />
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </Col>
                                <Col sm={12} md={6} className="mb-3">
                                    <FormGroup>
                                        <Label for="exampleEmail">Status</Label>
                                        <Input
                                            id="exampleSelect"
                                            value={status}
                                            name="select"
                                            type="select"
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Block</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <div className="text-end">
                                <Button color="info" onClick={createProjectButton}>Create New Project</Button>
                            </div>
                            <hr />
                            <Table className="no-wrap mt-3 align-middle" responsive bordered striped>
                                <thead>
                                    <tr>
                                        <th>Project Name</th>
                                        <th>Project Image</th>
                                        <th>Project Description</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        projectData?.map((item, index) => (
                                            <tr>
                                                <td className="w-20">{item.projectName}</td>
                                                <td className="w-10"><img src={item.projectPhoto} width='100' height='60' style={{ objectFit: 'cover' }} alt="projectImage"/></td>
                                                <td className="w-50">{item.projectDescription}</td>
                                                <td className="w-20">
                                                    <Button color="info" className="ms-3" onClick={() => selectProject(item._id, item.projectName, item.projectPhoto, item.projectDescription)}><i className='bi bi-pencil-square'></i></Button>
                                                    <Button color="danger" className="ms-3" onClick={() => deleteButton(item._id)}><i className='bi bi-trash'></i></Button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table><hr />
                            <Row>
                                <Col className="text-end">
                                    <Button color="info" className="ms-3" onClick={updateChurch}>Save Church</Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
                <Modal isOpen={modal} toggle={toggle} centered>
                    <ModalHeader toggle={toggle}>{projectId === '' ? 'Create New Project' : 'Update Project'}</ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col sm={12} md={12} className="mb-3">
                                <FormGroup>
                                    <Label for="exampleEmail">Project Name</Label>
                                    <Input
                                        id="exampleEmail"
                                        name="UserName"
                                        value={projectName}
                                        placeholder="Project Name"
                                        type="text"
                                        onChange={(e) => setProjectName(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                            <Col sm={12} md={12} className="mb-3">
                                <FormGroup>
                                    <Label for="exampleEmail">Project Image</Label>
                                    <Row>
                                        <Col sm={12} md={6} className="mb-3">{projectImage === '' ? <img src={DefaultImage} className="w-100" alt="defaultImage"/> : <img src={projectImage} className="w-100" alt="projectImage"/>}</Col>
                                        <Col sm={12} md={6} className="d-flex align-items-center justify-content-center mb-3">
                                            <ImageUploader
                                                onFileAdded={(img) => getProjectImageFileObject(img)}
                                                onFileRemoved={(img) => runAfterProjectImageDelete(img)}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>
                            </Col>
                            <Col sm={12} md={12} className="mb-3">
                                <FormGroup>
                                    <Label for="exampleEmail">Project Description</Label>
                                    <Input
                                        id="exampleEmail"
                                        name="UserName"
                                        placeholder="Project Name"
                                        type="textarea"
                                        value={projectDescription}
                                        onChange={(e) => setProjectDescription(e.target.value)}
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                    </ModalBody>
                    <ModalFooter>
                        {projectId === '' ? <Button color="info" onClick={createNewProject}>Create New Project</Button> : <Button color="info" onClick={updateProject}>Update Project</Button>}
                        <Button color="secondary" >
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={isOpen} toggle={() => setIsOpen(false)} centered='ture'>
                    <ModalBody className="text-center">
                        <h4 className="my-3">Are you sure you want to delete the project from the database?</h4>
                        <Button color="danger" className="ms-3" onClick={() => { deleteProject(); setIsOpen(false) }}>Yes</Button>
                        <Button color="info" className="ms-3" onClick={() => { setIsOpen(false) }}>No</Button>
                    </ModalBody>
                </Modal>
            </Row>
        </>
    );
};

export default ChurchDetail;
