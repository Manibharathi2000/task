import React, { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate()
    const [showAlert, setShowAlert] = useState(false);

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    const handleConfirmLogout = () => {
        navigate("/");
    };
    return (

        <div className="headerCls" style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "#011627",
            padding: "10px"
        }}>
            <span style={{ color: "white", marginRight: "10px" }}>Elon Musk</span>
            <div style={{
                backgroundColor: "red",
                width: "30px",
                height: "25px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "4px"
            }}>
                <AiOutlineLogout onClick={() => setShowAlert(true)} color="white" />
            </div>
            {showAlert && (
                <Alert
                    title={"Alert"}
                    msg={"Are you sure you want to logout?"}
                    open={true}
                    type={"yesorno"}
                    onClose={handleCloseAlert}
                    onConfirm={handleConfirmLogout}
                />
            )}
        </div>
    );
};

export default Header;
