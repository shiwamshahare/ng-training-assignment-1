import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { FaListCheck } from "react-icons/fa6";
import { SlMagnifier } from "react-icons/sl";
import { service } from "../services/service";
import TaskForm from "./TaskForm";

const TaskList = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTaskName, setDeleteTaskName] = useState(null);
  const [editTaskName, setEditTaskName] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [taskModal, setTaskModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tasks = await service.getAllTasks();
      setData(tasks);
      console.log(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const dataResult = data.filter((items) => {
    const caseLower = searchQuery.toLowerCase();
    return (
      items.AssignedTo.toLowerCase().includes(caseLower) ||
      items.comments.toLowerCase().includes(caseLower) ||
      items.status.toLowerCase().includes(caseLower) ||
      items.dueDate.toLowerCase().includes(caseLower) ||
      items.priority.toLowerCase().includes(caseLower)
    );
  });

  const handleDelete = async () => {
    try {
      await service.deleteTask(deleteTaskName.id);
      await fetchData();
      setDeleteTaskName(null);
      setDeleteModal(false);
    } catch (err) {
      console.error("Error in deleting ", err);
    }
  };
  const handleDeleteModal = (item) => {
    setDeleteTaskName(item);
    setDeleteModal(true);
  };

  const handleEdit = async (updateTask) => {
    try {
      await service.updateTask(updateTask);
      await fetchData();
      setEditTaskName(null);
      setTaskModal(false);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleEditModal = (item) => {
    setEditTaskName(item);
    setIsEditing(true);
    setTaskModal(true);
  };

  const handleAdd = async (newTask) => {
    try {
      await service.createTask(newTask);
      await fetchData();
      setTaskModal(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div>
      <div className="m-5 p-5">
        <div className="shadow w-100 ">
          <div className="d-flex bg-secondary-subtle border border-dark justify-content-between align-items-center border p-3 ">
            <div className="d-grid justify-content-center align-items-center p-2 pb-0">
              <span className="d-flex justify-content-center align-items-center gap-2">
                <span
                  className="bg-danger  d-flex justify-content-center align-items-center rounded-3 text-white"
                  style={{ width: "3rem", height: "3rem" }}
                >
                  <FaListCheck />
                </span>
                <span className="d-flex flex-column h-100 ">
                  <h5>Tasks</h5>
                  <span>All Tasks</span>
                </span>
              </span>
              <span>{data.length} records</span>
            </div>
            <div className="d-grid gap-2 p-2 ">
              <span>
                <button
                  className="btn text-primary border border-dark bg-light px-5"
                  style={{ borderRadius: "0" }}
                  onClick={() => {
                    setIsEditing(false);
                    setTaskModal(true);
                  }}
                >
                  New Task
                </button>
                <button
                  className="btn text-primary border border-dark bg-light px-5"
                  style={{ borderRadius: "0" }}
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </button>
              </span>
              <span className="d-flex justify-content-between border border-dark bg-light px-3">
                <input
                  type="text"
                  placeholder="Search"
                  className="border-0 w-100"
                  onFocus={(e) => (e.target.style.outline = "none")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn">
                  <SlMagnifier />
                </button>
              </span>
            </div>
          </div>
          <table className="table table-hover border  border-secondary">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" name="" id="" />
                </th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th colSpan="2">Comments</th>
              </tr>
            </thead>
            <tbody>
              {dataResult.map((item) => (
                <tr key={item.id}>
                  <td>{<input type="checkbox" name="" id="" />}</td>
                  <td className="text-primary">{item.AssignedTo}</td>
                  <td>{item.status}</td>
                  <td>{item.dueDate}</td>
                  <td>{item.priority}</td>
                  <td>{item.comments}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="none"
                        id="dropdown-basic"
                        className="border border-2"
                      ></Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleEditModal(item)}>
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDeleteModal(item)}>
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {deleteModal && (
          <Modal
            show
            size="lg"
            aria-labelledby="contained-modal-title-vcenter "
            centered
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header
              closeButton
              className="bg-danger text-white  justify-content-center"
              onClick={() => setDeleteModal(false)}
            >
              <Modal.Title id="contained-modal-title-vcenter ">
                Delete
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Do you want to delete task : {deleteTaskName.AssignedTo} ?</p>
            </Modal.Body>
            <Modal.Footer>
              <button
                className="btn btn-primary px-4"
                onClick={() => setDeleteModal(false)}
              >
                No
              </button>
              <button className="btn btn-secondary px-4" onClick={handleDelete}>
                Yes
              </button>
            </Modal.Footer>
          </Modal>
        )}
        {taskModal && (
          <TaskForm
            show={() => setTaskModal(true)}
            handleClose={() => setTaskModal(false)}
            handleSave={isEditing ? handleEdit : handleAdd}
            taskData={isEditing ? editTaskName : null}
            type={isEditing ? "Update" : "Save"}
          />
        )}
      </div>
    </div>
  );
};

export default TaskList;
