import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { RxCross2 } from "react-icons/rx";

const SimpleModal = ({ show, onClose, user }) => {
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState('');
    const [fname, setFname] = useState('');
    const [lastName, setLastname] = useState('');
    const [plink, setPLink] = useState('');

    useEffect(() => {
        if (user) {
            setEmail(user.email || '');
            setFname(user.first_name || '');
            setLastname(user.last_name || '');
            setPLink(user.avatar || '');
        } else {
            setEmail('');
            setFname('');
            setLastname('');
            setPLink('');
        }
    }, [user]);
    const handleClose = () => {
        setErrors({});
        setEmail('');
        setFname('');
        setLastname('');
        setPLink('');
        onClose(); // Call the parent close function
    };

    const validateField = (fieldName, value) => {
        let newErrors = { ...errors };

        if (fieldName === "fname") {
            newErrors.fname = value.trim() ? "" : "First name is required";
        }
        if (fieldName === "lname") {
            newErrors.lname = value.trim() ? "" : "Last name is required";
        }
        if (fieldName === "email") {
            if (!value.trim()) newErrors.email = "Email is required";
            else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = "Invalid email";
            else newErrors.email = "";
        }
        if (fieldName === "plink") {
            newErrors.plink = value.trim() ? "" : "Profile image link is required";
        }

        setErrors(newErrors);
    };
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents page refresh

        let newErrors = {};
        if (!fname.trim()) newErrors.fname = "First name is required";
        if (!lastName.trim()) newErrors.lname = "Last name is required";
        if (!email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email";
        if (!plink.trim()) newErrors.plink = "Profile image link is required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            if (user) {
                console.log("Updating user:", user.id);
            } else {
                console.log("Creating new user");
            }
            onClose();
        }
    };


    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header>
                <Modal.Title>{user ? "Edit User" : "Create New User"}</Modal.Title>
                <RxCross2 size={25} onClick={handleClose} style={{ cursor: "pointer" }} />
            </Modal.Header>
            <Modal.Body>
                {/* First Name */}
                <div className='input_container'>
                    <span className="required_star">*</span>
                    <label className='login_label'>First Name</label>
                    <div className='input_contanier'>
                        <input
                            type="text"
                            id="fname"
                            name="fname"
                            className='ce_input_box'
                            placeholder="Please enter first name"
                            value={fname}
                            onChange={(e) => {
                                setFname(e.target.value);
                                validateField("fname", e.target.value);
                            }}
                            onBlur={(e) => validateField("fname", e.target.value)}
                        />
                        {errors.fname && <div className="field_form_alert"><span>{errors.fname}</span></div>}
                    </div>
                </div>

                {/* Last Name */}
                <div className='input_container'>
                    <span className="required_star">*</span>
                    <label className='login_label'>Last Name</label>
                    <div className='input_contanier'>
                        <input
                            type="text"
                            id="lname"
                            name="lname"
                            className='ce_input_box'
                            placeholder="Please enter last name"
                            value={lastName}
                            onChange={(e) => {
                                setLastname(e.target.value);
                                validateField("lname", e.target.value);
                            }}
                            onBlur={(e) => validateField("lname", e.target.value)}
                        />
                        {errors.lname && <div className="field_form_alert"><span>{errors.lname}</span></div>}
                    </div>
                </div>

                {/* Email */}
                <div className='input_container'>
                    <span className="required_star">*</span>
                    <label className='login_label'>Email</label>
                    <div className='input_contanier'>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className='ce_input_box'
                            placeholder="Please enter email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                validateField("email", e.target.value);
                            }}
                            onBlur={(e) => validateField("email", e.target.value)}
                        />
                        {errors.email && <div className="field_form_alert"><span>{errors.email}</span></div>}
                    </div>
                </div>

                {/* Profile Image Link */}
                <div className='input_container'>
                    <span className="required_star">*</span>
                    <label className='login_label'>Profile Image Link</label>
                    <div className='input_contanier'>
                        <input
                            type="text"
                            id="plink"
                            name="plink"
                            className='ce_input_box'
                            placeholder="Please enter profile image link"
                            value={plink}
                            onChange={(e) => {
                                setPLink(e.target.value);
                                validateField("plink", e.target.value);
                            }}
                            onBlur={(e) => validateField("plink", e.target.value)}
                        />
                        {errors.plink && <div className="field_form_alert"><span>{errors.plink}</span></div>}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {user ? "Update" : "Submit"}
                </Button>

            </Modal.Footer>
        </Modal>
    );
};

export default SimpleModal;
