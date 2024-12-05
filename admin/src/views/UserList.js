import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Table, Card, CardTitle, CardBody, CardSubtitle, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { toast }from "react-toastify";
import { useUserContext } from "../context/Context";
import DataTable from 'react-data-table-component';

const UserList = () => {
    const [userData, setUserData] = useState([]);
    const [churchData, setChurchData] = useState()
    const [modal, setModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [birth, setBirth] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [language, setLanguage] = useState('');
    const [church, setChurch] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [status, setStatus] = useState(true);
    const [role, setRole] = useState('user');
    let _user = localStorage.getItem('user');
    let user = JSON.parse(_user);
    let _permission = localStorage.getItem('permission');
    let permission = JSON.parse(_permission);

    const toggle = () => setModal(!modal);

    const getUserData = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/accounts/get_all_users`, { headers })
            .then(function (response) {
                
                let users = [];
                for(let i = 0; i < response.data.users.length; i++) {
                    let user = {
                        id: response.data.users[i]._id,
                        avatarUrl: response.data.users[i].avatarUrl,
                        userName: response.data.users[i].userName,
                        userEmail: response.data.users[i].userEmail,
                        phoneNumber: response.data.users[i].phoneNumber,
                        address: response.data.users[i].address,
                        status: response.data.users[i].status,
                    }
                    users.push(user);
                }
                setUserData(users)
            })
            .catch(function (error) {

            });
    }

    const getChurchList = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/church/all_churches`, { headers })
            .then(function (response) {
                setChurchData(response.data.church);
            })
            .catch(function (error) {
            });
    }

    const adminGetUserList = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }

        console.log('adonis', permission.church)
        
        const data = {
            church: permission.church
        }
        await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/accounts/admin_get_users_list`, data, { headers })
            .then(function (response) {
                let users = [];
                for(let i = 0; i < response.data.users.length; i++) {
                    let user = {
                        id: response.data.users[i]?._id,
                        avatarUrl: response.data.users[i]?.avatarUrl,
                        userName: response.data.users[i]?.userName,
                        userEmail: response.data.users[i]?.userEmail,
                        phoneNumber: response.data.users[i]?.phoneNumber,
                        address: response.data.users[i]?.address,
                        status: response.data.users[i]?.status,
                    }
                    users.push(user);
                }
                setUserData(users)
            })
            .catch(function (error) {

            });
    }

    useEffect(() => {
        if(user?.role == 'super') {
            getUserData();
            
        } 
        else {
            adminGetUserList();
        }
        getChurchList();
    }, [modal, isOpen]);

    const editUser = async (id) => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/accounts/get_user/${id}`, { headers })
            .then(function (response) {
                setUserId(response.data.user._id);
                setUserName(response.data.user.userName);
                setUserEmail(response.data.user.userEmail);
                setBirth(response.data.user.birth);
                setPhone(response.data.user.phoneNumber);
                setAddress(response.data.user.address);
                setLanguage(response.data.user.language);
                setChurch(response.data.user.church);
                setAvatarUrl(response.data.user.avatarUrl);
                setStatus(response.data.user.status);
                toggle();
            })
            .catch(function (error) {
                toast.error(error)
            });

    }

    const deleteButton = async (id) => {
        setIsOpen(true);
        setUserId(id);
    }

    const deleteUser = async () => {


        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }

        await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/accounts/delete_user/${userId}`, { headers })
            .then(function (response) {
                toast.success(response.data.message);
            })
            .catch(function (error) {
                toast.error(error)
            });

    }

    const updateUserDate = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }

        // if (userName === '' || userEmail === '' || phone === '' || birth === '') {
        //     toast.error('You must input field');
        //     return
        // }

        await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/accounts/update_profile`,
            {
                userId: userId,
                username: userName,
                useremail: userEmail,
                phonenumber: phone,
                birth: birth,
                language: language,
                address: address,
                church: church,
                avatarurl: avatarUrl,
                status: status,
                role: role
            },
            { headers })
            .then(function (response) {
                toast.success(response.data.message);
                toggle();
            })
            .catch(function (error) {
                console.log(error)
            });
    }

    const columns = [
        {
            name: 'UserInfo',
            selector: row => (
                <div className="d-flex align-items-center p-2">
                    <img
                        src={row.avatarUrl}
                        className="rounded-circle"
                        alt="avatar"
                        width="45"
                        height="45"
                    />
                    <div className="ms-3">
                        <h6 className="mb-0">{row.userName}</h6>
                        <span className="text-muted">{row.userEmail}</span>
                    </div>
                </div>
            ),
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phoneNumber,
            sortable: true,
        },
        {
            name: 'Address',
            cell: row => row.address
        },
        {
            name: 'Status',
            selector: row => row.status === true ? (<Badge color="info">Active</Badge>) : (<Badge color="danger">Block</Badge>),
            sortable: true,
        },
        {
            name: 'Action',
            selector: row => (
                <td>
                    <Button color="info" className="ms-3" onClick={() => editUser(row.id)}><i className='bi bi-pencil-square'></i></Button>
                    {user?.role == 'super' && (<Button color="danger" className="ms-3" onClick={() => deleteButton(row.id)}><i className='bi bi-trash'></i></Button>)}                                                
                </td>
            )
        },
    ];

    return (
        <>
            <Row>
                <Col lg="12">
                    <Card>
                        <CardBody>
                            <DataTable title="Users" pagination columns={columns} data={userData} defaultSortFieldId={1}/>                            
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm={12} md={6} className="mb-3">
                            <FormGroup>
                                <Label for="exampleEmail">UserName</Label>
                                <Input
                                    id="exampleEmail"
                                    name="UserName"
                                    value={userName}
                                    placeholder="UserName"
                                    type="UserName"
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={12} md={6} className="mb-3">
                            <FormGroup>
                                <Label for="exampleEmail">UserEmail</Label>
                                <Input
                                    id="exampleEmail"
                                    name="UserEmail"
                                    value={userEmail}
                                    placeholder="UserEmail"
                                    type="email"
                                    onChange={(e) => setUserEmail(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={12} md={6} className="mb-3">
                            <FormGroup>
                                <Label for="exampleEmail">Birth</Label>
                                <Input
                                    id="exampleEmail"
                                    name="Birth"
                                    value={birth}
                                    placeholder="Birth"
                                    type="date"
                                    onChange={(e) => setBirth(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={12} md={6} className="mb-3">
                            <FormGroup>
                                <Label for="exampleEmail">PhoneNumber</Label>
                                <Input
                                    id="exampleEmail"
                                    name="email"
                                    value={phone}
                                    placeholder="PhoneNumber"
                                    type="tel"
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={12} md={6} className="mb-3">
                            <FormGroup>
                                <Label for="exampleEmail">Address</Label>
                                <Input
                                    id="exampleEmail"
                                    name="email"
                                    value={address}
                                    placeholder="Address"
                                    type="text"
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={12} md={6} className="mb-3">
                            <FormGroup>
                                <Label for="exampleEmail">Language</Label>
                                <Input
                                    id="exampleSelect"
                                    value={language}
                                    name="select"
                                    type="select"
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="EN">English</option>
                                    <option value="FR">French</option>
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col sm={12} md={12} className="mb-3">
                            <FormGroup>
                                <Label for="exampleEmail">Church</Label>
                                <Input
                                    id="exampleSelect"
                                    name="select"
                                    type="select"
                                    value={church}
                                    disabled={user.role == 'super' ? "true" : "false"}
                                    onChange={(e) => setChurch(e.target.value)}
                                >
                                    {churchData?.map((item, index) => (
                                        <option key={index} value={item._id}>{item.churchName}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                        {
                            user?.role === "super" && (
                                <Col sm={12} md={12} className="mb-3">
                                    <FormGroup>
                                        <Label for="exampleEmail">Role</Label>
                                        <Input
                                            id="exampleSelect"
                                            name="select"
                                            type="select"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">SubAdmin</option>
                                        </Input>
                                    </FormGroup>
                                </Col>
                            )
                        }
                        <Col sm={12} md={12} className="mb-3">
                            <FormGroup>
                                <Label for="exampleEmail">Status</Label>
                                <Input
                                    id="exampleSelect"
                                    name="select"
                                    type="select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Block</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={updateUserDate}>
                        Save
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={isOpen} toggle={() => setIsOpen(false)} centered='ture'>
                <ModalBody className="text-center">
                    <h4 className="my-3">Are you sure you want to delete the user from the database?</h4>
                    <Button color="danger" className="ms-3" onClick={() => { deleteUser(); setIsOpen(false) }}>Yes</Button>
                    <Button color="info" className="ms-3" onClick={() => { setIsOpen(false) }}>No</Button>
                </ModalBody>
            </Modal>

        </>
    );
};

export default UserList;
