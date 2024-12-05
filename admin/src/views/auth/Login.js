import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    Card,
    Row,
    Col,
    CardTitle,
    CardBody,
    Button,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { useUserContext } from "../../context/Context";

const Login = () => {
    const { signIn, permissions } = useUserContext();
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const LoginButton = async () => {
        console.log("LoginButton clicked"); // Log button click
        let data = {
            useremail: userEmail,
            password: password
        };

        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_API_URL}/api/accounts/signin_admin`, data);
            console.log("Response received:", response.data); // Log the response data
            toast.success(response.data.message);

            // Set user and permissions in context
            signIn(response.data.user);
            permissions(response.data.permission);
            localStorage.setItem('token', response.data.token);

            // Check if role is admin
            console.log("User role:", response.data.user.role); // Log user role
            if (response.data.user.role === 'admin') {
                console.log('Admin Role Detected');
                // Log permission object to ensure it's correct
                console.log("Permissions:", response.data.permission);

                if (response.data.permission?.churchPermission === true) {
                    console.log("Navigating to /admin/church_list");
                    navigate("/admin/church_list");
                    return;
                }
                if (response.data.permission?.notificationPermission === true) {
                    console.log("Navigating to /admin/notification_list");
                    navigate("/admin/notification_list");
                    return;
                }
                if (response.data.permission?.transactionPermission === true) {
                    console.log("Navigating to /admin/transaction_list");
                    navigate("/admin/transaction_list");
                    return;
                }
            } else {
                console.log("Navigating to /admin/user_list");
                navigate("/admin/user_list");
            }
        } catch (error) {
            console.error("Error during login:", error); // Log the error
            if (error.response?.status === 401) {
                toast.error(error.response.data.message);
            }
            if (error.response?.status === 500) {
                toast.error(error.response.data.message);
            }
        }
    };

    return (
        <Row className="d-flex align-items-center h-100">
            <Col sm={12} md={4} className="mx-auto">
                <Card className="p-5">
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0 text-center">
                        <h3>Church App Admin Dashboard</h3>
                    </CardTitle>
                    <CardBody>
                        <div>
                            <FormGroup>
                                <Label for="exampleEmail">Email</Label>
                                <Input
                                    id="exampleEmail"
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="examplePassword">Password</Label>
                                <Input
                                    id="examplePassword"
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </FormGroup>
                            <div className="text-center">
                                <Button className="mt-2" onClick={LoginButton}>Submit</Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default Login;