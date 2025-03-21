import React from "react";
import { Modal, ModalBody } from "react-bootstrap";
import { AiOutlineClose } from "react-icons/ai";
import './Alert.css'

import { Button } from "antd";
const Alert = ({ title, msg, open, type, onClose, onConfirm }) => {
  return (
    <>
      <Modal size="md" centered show={open} onHide={onClose}>
        <ModalBody>
          <div style={{ display: "flex", justifyContent: "end", fontSize: "20px" }}className="modal_close_icon_container" onClick={onClose}>
            <AiOutlineClose  style={{ color: "red", cursor: "pointer" }} />
          </div>
          <div>
            <div className="mdlcmd_subhead">
              <span className="commands_txt">{title}</span>
            </div>
            <div className="cmd_container">
              <div style={{ padding: "20px" }}>
                <div style={{ display: "flex", textAlign: "center" }}>
                  {console.log(msg)}
                  <span
                  >
                    {msg}
                  </span>
                </div>
              </div>
            </div>
            <div className='mdlcmd_subhead mdlcmd_subhead_container'>
                            {type === "info" &&
                                <Button variant="contained" onClick={onClose}>Okay</Button>
                                // <button type="button" onClick={onClose} className="modalcommad_btn info"><text>{language.Okay}</text></button>
                            }
                            {type === "success" &&
                                <Button variant="contained" onClick={onClose}>Okay</Button>
                                // <button type="button" onClick={onClose} className="modalcommad_btn SUCCESS"><text>{language.Okay}</text></button>
                            }
                            {type === "error" &&
                                <Button variant="contained" onClick={onClose}>Okay</Button>
                                // <button type="button" onClick={onClose} className="modalcommad_btn error"><text>{language.close}</text></button>
                            }
                            {type === "yesorno" &&
                                <>
                                 <Button variant="outlined" color='primary'  onClick={onClose}>No</Button>
                                 <span style={{ margin: '0 10px' }}></span> {/* Add a span for spacing */}
                                    <Button variant="contained" onClick={onConfirm}>Yes</Button>
                                    
                                   
                                </>
                            }
                        </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Alert;




















