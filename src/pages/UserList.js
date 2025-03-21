import React, { useEffect, useState, useCallback } from "react";
import { Table, Button, Space, Avatar, Card, Flex } from "antd";
import { EditOutlined, DeleteOutlined, AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import "./Userlist.css";
import Search from "antd/es/input/Search";
import SimpleModal from "./CreateeditUser";
import Alert from "../components/Alert";
import { useAppContext } from "../Apiservice/AppProvider";
import Header from "../components/Header";

const UserView = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [view, setView] = useState("table");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { GetApi } = useAppContext();
  const [userToDelete, setUserToDelete] = useState(null);

  const getuserpage = useCallback((page) => {
    const url = "/users";
    const params = { page };

    GetApi("GET", url, params)
      .then((response) => {
        console.log(response.data, `Response for page ${page}`);
        setData(response.data.data);
        setTotalRecords(response.data.total || 0);
        setCurrentPage(page);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [GetApi]); // Ensure 'GetApi' is included in dependencies if it's from context

  useEffect(() => {
    getuserpage(1);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setView(window.innerWidth <= 768 ? "card" : "table");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getuserpage]); // No more ESLint warning


  const handleCloseAlert = () => {
    setShowAlert(false);
  };


  const handleDeleteClick = (key) => {
    setUserToDelete(key);
    setShowAlert(true);
  };

  const handleDelete = (key) => {
    setData((prevData) => prevData.filter((item) => item.key !== key));
  };

  const confirmDelete = () => {
    if (userToDelete) {
      handleDelete(userToDelete);
    }
    handleCloseAlert();
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const filteredData = data.filter(
    (item) =>
      item?.first_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item?.last_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item?.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => <Avatar src={avatar} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a href={`mailto:${text}`}>{text}</a>,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "lastName",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} type="primary" danger onClick={() => handleDeleteClick(record.key)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Header />
      <div className="app-container">
        <Flex justify="space-between" align="center" className="header-controls">
          <h2 className="users-title">Users</h2>
          <div className="search-create-wrapper">
            <Search placeholder="input search text" onChange={(e) => setSearchText(e.target.value)} className="search-box" />
            <Button type="primary" onClick={() => setShowModal(true)} className="create-user-btn">
              Create User
            </Button>
          </div>
        </Flex>
        {/* Table and Card View Toggle */}
        {!isMobile && (
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

        {view === "table" && !isMobile ? (
          <Table
            columns={columns}
            dataSource={filteredData.map((item) => ({ ...item, key: item.id }))}
            pagination={{
              current: currentPage,
              pageSize: 6,
              total: totalRecords,
              onChange: (page) => getuserpage(page),
            }}
            scroll={{ x: "max-content" }}
          />
        ) : (
          <div className="card-container">
            {filteredData.map((user) => (
              <Card key={user.id} className="user-card">
                <div className="user-card-content">
                  <Avatar size={64} src={user.avatar} className="user-avatar" />
                  <h3>{user.first_name} {user.last_name}</h3>
                  <p>{user.email}</p>
                </div>
                <div className="card-actions">
                  <Button shape="circle" icon={<EditOutlined />} className="edit-btn" onClick={() => handleEdit(user)} />
                  <Button shape="circle" icon={<DeleteOutlined />} className="delete-btn" onClick={() => handleDeleteClick(user.id)} />
                </div>
              </Card>
            ))}
          </div>
        )}

        <SimpleModal show={showModal} onClose={handleModalClose} user={selectedUser} />
        {showAlert && (
          <Alert
            title={"Alert"}
            msg={"Are you sure you want to delete this user?"}
            open={true}
            type={"yesorno"}
            onClose={handleCloseAlert}
            onConfirm={confirmDelete}
          />
        )}
      </div>
    </>
  );
};

export default UserView;
