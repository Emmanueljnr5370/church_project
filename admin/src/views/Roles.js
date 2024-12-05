import { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Table, Button, FormGroup, Input, Modal, ModalBody, Label, Badge } from "reactstrap";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const RolesPage = () => {
  const [managers, setManagers] = useState([]);
  const [churchPermission, setChurchPermission] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [transactionPermission, setTransactionPermission] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState([]);
  const [churchData, setChurchData] = useState([]);
  const [id, setId] = useState(null);
  const [userId, setUserId] = useState(null);

  const getUserData = async () => {
    const token = localStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    }
    await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/role/get_managers`, { headers })
      .then(function (response) {
        setManagers(response.data.managers)
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
        let data = [];
        for (let i = 0; i < response.data?.church?.length; i++) {
          let _data = { label: response.data.church[i].churchName, value: response.data.church[i]._id }
          data.push(_data);
        }
        setChurchData(data);
      })
      .catch(function (error) {
        console.log("------profile church------", error)

      });
  }

  const editbutton = async (id) => {
    
    const token = localStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    }
    await axios.get(`${process.env.REACT_APP_SERVER_API_URL}/api/role/get_manager/${id}`, { headers })
      .then(function (response) {
        setChurchPermission(response.data?.managers?.churchPermission);
        setNotificationPermission(response.data?.managers?.notificationPermission);
        setTransactionPermission(response.data?.managers?.transactionPermission);
        if(response.data?.managers?.church.length > 0) {
          setSelected(response.data?.managers?.church);
        } else {
          setSelected([]);
        }
        setId(response.data?.managers?._id);
        setEditModal(true);
      })
      .catch(function (error) {
        console.log(error)
      });
      
  }

  const updateManager = async () => {
    const token = localStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    }

    console.log(selected)
    if(selected.length == 0) {
      toast.error('Please select church');
      return
    }

    let data = {
      id: id,
      church: selected,
      churchPermission: churchPermission,
      notificationPermission: notificationPermission,
      transactionPermission: transactionPermission
    }

    await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/role/update_role`,  data, { headers })
      .then(function (response) {
        console.log(response.data);
        toast.success(response.data.message)
        setEditModal(false);
      })
      .catch(function (error) {
        console.log("------profile church------", error)

      });
  }

  const deletebutton = (id, userId) => {
    setDeleteModal(true);
    setId(id);
    setUserId(userId)
  }

const deleteManager = async () => {
  const token = localStorage.getItem('token');
  const headers = {
    authorization: `${token}`
  }
  let data ={
    id: id,
    userId: userId
  }
  await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/role/delete_manager`, data, { headers })
  .then(function (response) {
    console.log(response.data)
    toast.success(response.data.message);
    setDeleteModal(false);
  })
  .catch(function (error) {
    console.log("------profile church------", error)

  });
}


  useEffect(() => {
    getUserData();
    getChurchList();
  }, []);

  useEffect(() => {
    getUserData();
    getChurchList();
  }, [editModal, deleteModal]);

console.log('selected', selected);
  return (
    <Row>
      <Col>
        <Card>
          <CardTitle tag="h5" className="p-3 mb-0">
            SubAdmins
          </CardTitle>
          <CardBody className="p-4">
            <Table className="no-wrap mt-3 align-middle" responsive>
              <thead>
                <tr>
                  <th className="border border-bottom-0"></th>
                  <th className="border border-bottom-0"></th>
                  <th colSpan={3} className="text-center border">Permissions</th>
                  <th className="border border-bottom-0"></th>
                </tr>
                <tr>
                  <th className="border border-top-0 text-center">UserInfo</th>
                  <th className="border border-top-0 text-center">Churches</th>
                  <th className="border text-center">Projects</th>
                  <th className="border text-center">Notifications</th>
                  <th className="border text-center">Transactions</th>
                  <th className="border border-top-0">Action</th>
                </tr>
              </thead>
              <tbody>
                {managers?.map((tdata, index) => (
                  <tr key={index} className="border-top">
                    <td className="border">
                      <div className="d-flex align-items-center p-2">
                        <img
                          src={tdata.userId?.avatarUrl}
                          className="rounded-circle"
                          alt="avatar"
                          width="45"
                          height="45"
                        />
                        <div className="ms-3">
                          <h6 className="mb-0">{tdata.userId.userName}</h6>
                          <span className="text-muted">{tdata.userId.userEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td className="border text-start"><ul className="mb-0">{tdata.church.map((item) => (
                      
                        <li><Link to={`/admin/church_list/${item.value}`} className="nav-link text-primary">{`${item.label},`}</Link></li>
                      
                    ))}</ul></td>
                    <td className="border text-center">
                      {tdata.churchPermission == true ? <Badge color="info">YES</Badge>  : <Badge color="danger">NO</Badge>}
                      {/* <FormGroup
                        check
                        inline
                      >
                        <Input type="checkbox" checked={tdata.churchPermission} />
                      </FormGroup> */}
                    </td>
                    <td className="border text-center">
                    {tdata.notificationPermission == true ? <Badge color="info">YES</Badge>  : <Badge color="danger">NO</Badge>}
                      {/* <FormGroup
                        check
                        inline
                      >
                        <Input type="checkbox" checked={tdata.notificationPermission} />
                      </FormGroup> */}
                    </td>
                    <td className="border text-center">
                    {tdata.transactionPermission == true ? <Badge color="info">YES</Badge>  : <Badge color="danger">NO</Badge>}
                      {/* <FormGroup
                        check
                        inline
                      >
                        <Input type="checkbox" checked={tdata.transactionPermission} />
                      </FormGroup> */}
                    </td>
                    <td className="border">
                      <Button color="info" className="ms-3" onClick={() => editbutton(tdata._id)}><i className='bi bi-pencil-square'></i></Button>
                      <Button color="danger" className="ms-3" onClick={() => deletebutton(tdata._id, tdata.userId._id)}><i className='bi bi-trash'></i></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Col>
      <Modal isOpen={editModal} toggle={() => setEditModal(false)} centered='ture' size="lg">
        <ModalBody>
          <h4 className="my-3 text-center">Update SubAdmin Permissions</h4>
          <Row>
            <Col className="mb-3">
              <Label className="text-start">Select Church</Label>
              <MultiSelect
                options={churchData}
                value={selected}
                onChange={setSelected}
                labelledBy="Select"
              />
            </Col>
          </Row>
          <hr className="pb-3" />
          <Label className="text-start">Permissions</Label>
          <Row >
            <Col sm={12} md={4} className="mb-3">
              <FormGroup
                check
                inline
              >
                <Input type="checkbox" checked={churchPermission} onChange={() => setChurchPermission(!churchPermission)} />
                <Label check>
                  Projects
                </Label>
              </FormGroup>
            </Col>
            <Col sm={12} md={4} className="mb-3">
              <FormGroup
                check
                inline
              >
                <Input type="checkbox" checked={notificationPermission} onChange={() => setNotificationPermission(!notificationPermission)} />
                <Label check>
                  Notifications
                </Label>
              </FormGroup>
            </Col>
            <Col sm={12} md={4} className="mb-3">
              <FormGroup
                check
                inline
              >
                <Input type="checkbox" checked={transactionPermission} onChange={() => setTransactionPermission(!transactionPermission)} />
                <Label check>
                  Transactions
                </Label>
              </FormGroup>
            </Col>
          </Row>
          <hr />
          <Button color="success" className="ms-3" onClick={updateManager}>Save</Button>
          <Button  className="ms-3" onClick={() => setEditModal(false)}>Cancel</Button>
        </ModalBody>
      </Modal>
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)} centered='ture'>
        <ModalBody className="text-center">
          <h4 className="my-3">Are you sure you want to delete the SubAdmin from the database?</h4>
          <Button color="danger" className="ms-3" onClick={deleteManager}>Yes</Button>
          <Button color="info" className="ms-3" onClick={() => setDeleteModal(false)}>No</Button>
        </ModalBody>
      </Modal>
    </Row>
  );
};

export default RolesPage;
