import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Table, Card, CardTitle, CardBody, CardSubtitle, Badge, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Input, Label } from "reactstrap";
import { toast }from "react-toastify";
import DataTable from 'react-data-table-component';

const NotificationList = () => {

    const [modal, setModal] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [church, setChurch] = useState('all');
    const [notificationList, setNotificationList] = useState([]);

    let _user = localStorage.getItem('user');
    let user = JSON.parse(_user);
    let _permission = localStorage.getItem('permission');
    let permission = JSON.parse(_permission);

    const toggle = () => setModal(!modal);

    const createButton = () => {
        setTitle('');
        setDescription('');
        toggle();
    }

    const createNotification = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');
        const headers = {
            authorization: `${token}`
        }

        if (title === '' || description === '') {
            toast.error('You must input field');
            return
        }

        const newNotification = {
            userID: userId,
            notificationTitle: title,
            notificationType: user?.role == 'super' ? "Super" : "Admin",
            description: description,
            churchId : church
        };

        await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/notifications/create_notification`,
            newNotification,
            { headers })
            .then(function (response) {
                toast.success(response.data.message);
                let notifications = [];
                for (let i = 0; i < response.data.notification.length; i++) {
                    let notification = {
                        id: i,
                        notificationTitle : response.data.notification[i].notificationTitle,
                        notificationType : response.data.notification[i].notificationType,
                        description : response.data.notification[i].description,
                        createdDate : response.data.notification[i].createdDate,
                        status : response.data.notification[i].status,
                    }

                    notifications.push(notification);
                }
                setNotificationList(notifications)
                toggle();
            })
            .catch(function (error) {
                console.log(error)
            });
    }

    const getNotification = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }
        await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/notifications/get_all_notifications`, { headers })
            .then(function (response) {
                let notifications = [];
                for (let i = 0; i < response.data.notification.length; i++) {
                    let notification = {
                        id: i,
                        notificationTitle : response.data.notification[i].notificationTitle,
                        notificationType : response.data.notification[i].notificationType,
                        description : response.data.notification[i].description,
                        createdDate : response.data.notification[i].createdDate,
                        status : response.data.notification[i].status,
                    }

                    notifications.push(notification);
                }
                setNotificationList(notifications)
            })
            .catch(function (error) {

            });
    }

    const adminGetNotificationList = async () => {
        const token = localStorage.getItem('token');
        const headers = {
            authorization: `${token}`
        }

        const data = {
            church: permission.church
        }

        await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/notifications/admin_get_notification_list`,data, { headers })
            .then(function (response) {
                let notifications = [];
                for (let i = 0; i < response.data.notification.length; i++) {
                    let notification = {
                        id: i,
                        notificationTitle : response.data.notification[i].notificationTitle,
                        notificationType : response.data.notification[i].notificationType,
                        description : response.data.notification[i].description,
                        createdDate : response.data.notification[i].createdDate,
                        status : response.data.notification[i].status,
                    }

                    notifications.push(notification);
                }
                setNotificationList(notifications)
            })
            .catch(function (error) {

            });
    }

    const columns = [
        {
            name: 'Notification title',
            selector: row => row.notificationTitle,
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row.notificationType,
            sortable: true,
        },
        {
            name: 'Description',
            cell: row => row.description
        },
        {
            name: 'Created',
            selector: row => row.createdDate,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status === true ? (<Badge color="info">Active</Badge>) : (<Badge color="danger">Block</Badge>),
            sortable: true,
        }
    ];



    useEffect(() => {
        if(user?.role === "admin") {
            adminGetNotificationList();
        } else {
            getNotification();
        }
    }, [modal]);

    return (
        <>
            <Row>
                <Col lg="12">
                    <Card>
                        <CardBody>
                            <DataTable title="Notifications" pagination subHeader subHeaderComponent={<Button color="info" onClick={createButton}>Create Notification</Button>} columns={columns} data={notificationList} defaultSortFieldId={1}/>                            
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Modal isOpen={modal} toggle={toggle} centered>
                <ModalHeader toggle={toggle}>Create New Notification</ModalHeader>
                <ModalBody>
                    <Row>
                        <Col sm={12} md={12} className="mb-3">
                            <FormGroup>
                                <Label for="exampleEmail">Notification Title</Label>
                                <Input
                                    id="exampleEmail"
                                    name="UserName"
                                    placeholder="Notification Title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        <Col sm={12} md={12} className="mb-3">
                            <FormGroup>
                                <Label for="exampleEmail">Notification Description</Label>
                                <Input
                                    id="exampleEmail"
                                    name="UserName"
                                    placeholder="Notification Description"
                                    type="textarea"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                        {user?.role === 'admin' && (
                            <Col sm={12} md={12} className="mb-3">
                                <FormGroup>
                                    <Label for="exampleEmail">Church</Label>
                                    <Input
                                        id="exampleSelect"
                                        name="select"
                                        type="select"
                                        value={church}
                                        onChange={(e) => setChurch(e.target.value)}
                                    >
                                        <option >Select Church</option>
                                        {permission.church.map((item, index) => (
                                            <option value={item.value} key={index}>{item.label}</option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </Col>
                        )}
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="info" onClick={createNotification}>Create New Notification</Button>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default NotificationList;
