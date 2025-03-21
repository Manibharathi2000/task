import React, { useEffect, useState } from "react";
import { Table, Button, Space, Card, Flex, Tag } from "antd";
import { EditOutlined, AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import "./Userlist.css";
import Search from "antd/es/input/Search";
import { useAppContext } from "../Apiservice/AppProvider";
import { Modal } from "react-bootstrap";

const TaskList = () => {
    const [data, setData] = useState([]);
    const [view, setView] = useState("table");
    const [searchText, setSearchText] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [userName, setUserName] = useState("");
    const [team, setTeam] = useState("");

    const { GetApi } = useAppContext();

    useEffect(() => {
        getTaskList();
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setView("card");
            } else {
                setView("table");
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getTaskList = () => {
        GetApi("GET", "/tasks", {})
            .then((response) => {
                console.log(response.data, "task response");
                setData(response?.data);
            })
            .catch((error) => console.log(error));
    };

    const getTaskDetailsById = (userId) => {
        GetApi("GET", `/users/${userId}`, {})
            .then((response) => {
                console.log(response.data, "User Details");
                setUserName(response.data.name);
                setTeam(response.data.team);
                setShowModal(true); // Open modal with fetched data
            })
            .catch((error) => console.log(error));
    };

    const filteredData = Array.isArray(data)
        ? data.filter((item) =>
            (item?.title?.toLowerCase() || "").includes(searchText.toLowerCase())
        )
        : [];



    const columns = [
        { title: "User ID", dataIndex: "userId", key: "userId" },
        { title: "Title", dataIndex: "title", key: "title" },
        {
            title: "Status",
            dataIndex: "completed",
            key: "completed",
            render: (completed) => (
                <Tag color={completed ? "green" : "orange"}>
                    {completed ? "Completed" : "In Process"}
                </Tag>
            ),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button
                    icon={<EditOutlined />}
                    type="primary"
                    onClick={() => getTaskDetailsById(record.userId)}
                >
                    View
                </Button>
            ),
        },
    ];

    return (
        <div>
            <div className="app-container">
                <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                    <h2 className="users-title">Task List</h2>
                    <Space>
                        <Search placeholder="Search" onChange={(e) => setSearchText(e.target.value)} />
                    </Space>
                </Flex>

                {/* Hide table buttons in mobile */}
                {window.innerWidth > 768 && (
                    <Space style={{ marginBottom: 16 }}>
                        <Button
                            type="default"
                            icon={<UnorderedListOutlined />}
                            onClick={() => setView("table")}
                            style={{
                                borderColor: view === "table" ? "#1890ff" : "#d9d9d9",
                                color: view === "table" ? "#1890ff" : "black",
                            }}
                        >
                            Table View
                        </Button>
                        <Button
                            type="default"
                            icon={<AppstoreOutlined />}
                            onClick={() => setView("card")}
                            style={{
                                borderColor: view === "card" ? "#1890ff" : "#d9d9d9",
                                color: view === "card" ? "#1890ff" : "black",
                            }}
                        >
                            Card View
                        </Button>
                    </Space>
                )}

                {/* Table View (Hidden on Mobile) */}
                {view === "table" && window.innerWidth > 768 && (
                    <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} />
                )}

                {/* Card View (Always Shown on Mobile) */}
                {view === "card" && (
                    <div className="card-container">
                        {filteredData.map((user) => (
                            <Card key={user.userId} className="user-card">
                                <div className="user-card-content">
                                    <h5>{user.title}</h5>
                                    <Tag color={user.completed ? "green" : "orange"}>
                                        {user.completed ? "Completed" : "In Process"}
                                    </Tag>
                                </div>
                                <div className="card-actions">
                                    <Button
                                        shape="circle"
                                        icon={<EditOutlined />}
                                        className="edit-btn"
                                        onClick={() => getTaskDetailsById(user.userId)}
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Modal to Show User Details */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>User Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <label style={{ width: "100px", fontWeight: "bold" }}>Name:</label>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={userName}
                                    readOnly
                                    style={{
                                        flex: 1,
                                        padding: "8px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <label style={{ width: "100px", fontWeight: "bold" }}>Team:</label>
                                <input
                                    type="text"
                                    placeholder="Team"
                                    value={team}
                                    readOnly
                                    style={{
                                        flex: 1,
                                        padding: "8px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                    }}
                                />
                            </div>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default TaskList;
