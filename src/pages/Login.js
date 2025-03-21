import React, { useEffect, useState } from 'react';
import { RiLockLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../Apiservice/AppProvider';
import './Login.css';
import Alert from '../components/Alert';
import { LuUserRound } from "react-icons/lu";


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { PostApi } = useAppContext();


    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        const savedPassword = localStorage.getItem("rememberedPassword");
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        } else {
            localStorage.clear();
        }
    }, []);


    const handleEmailChange = (value) => {
        setEmail(value);
        validateEmail(value);
    };

    const handlePasswordChange = (value) => {
        setPassword(value);
        validatePassword(value);
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!email.trim()) {
            errors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email address is invalid";
            isValid = false;
        }

        if (!password.trim()) {
            errors.password = "Password is required";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
    };

    const validateEmail = (value) => {
        if (!value.trim()) {
            setErrors(prevErrors => ({ ...prevErrors, email: 'Email is required' }));
        } else if (!/\S+@\S+\.\S+/.test(value)) {
            setErrors(prevErrors => ({ ...prevErrors, email: 'Please Enter the Valid Email' }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, email: '' }));
        }
    };

    const validatePassword = (value) => {
        if (!value.trim()) {
            setErrors(prevErrors => ({ ...prevErrors, password: 'Password is required' }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, password: '' }));
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            const url = "/login";
            const data = {
                email: email,
                password: password,
            };
    
            try {
                const response = await PostApi('POST', url, data);
                console.log(response, "login");
    
                if (response.status === 200) {
                    if (rememberMe) {
                        localStorage.setItem("rememberedEmail", email);
                        localStorage.setItem("rememberedPassword", password);
                    } else {
                        localStorage.removeItem("rememberedEmail");
                        localStorage.removeItem("rememberedPassword");
                    }
                    console.log("Logged in successfully");
                    localStorage.setItem('tkn', response.data.token);
                    navigate('/userList');
                } 
            } catch (error) {
                console.error("Login failed:", error);
    
                if (error.response) {
                    // Server responded with an error
                    console.log("Response Error:", error.response);
                    setAlertMessage(error.response.data.error || "Something went wrong!");
                    setShowAlert(true);
                } 
            }
        }
    };
    
    return (
        <div>
            <div className="login_container2_bg">
                <div className='login_card_brds'>
                    <form onSubmit={handleLogin}>
                        <div className='input_container'>
                            <div className='input_contanier'>
                                <div className="input_icons">
                                    <LuUserRound />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className='input_box'
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) =>
                                        handleEmailChange(e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <div className="field_form_alert">
                                        <span>{errors.email}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='input_container'>
                            <div className='input_contanier'>
                                <div className="input_icons">
                                    <RiLockLine />
                                </div>
                                <input
                                    type={"text"}
                                    value={password}
                                    className='input_box'
                                    placeholder="Password"
                                    onChange={(e) => handlePasswordChange(e.target.value)}
                                />
                                {errors.password && (
                                    <div className="field_form_alert">
                                        <span>{errors.password}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='remember_container'>
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="rememberMe" className="forgot_pass_text">Remember me</label>
                        </div>
                        <div className='login_btn_container'>
                            <button className="login_btn" type="submit">Log in</button>
                        </div>
                        {showAlert && (
                            <Alert
                                title={"Alert"}
                                msg={alertMessage}
                                open={true}
                                type={"info"}
                                onClose={handleCloseAlert}
                            />
                        )}
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Login;