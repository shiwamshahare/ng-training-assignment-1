import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import { FaListCheck } from "react-icons/fa6";
import {
  FaAngleDoubleUp,
  FaAngleDoubleDown,
  FaAngleLeft,
  FaAngleRight,
  FaSearch,
} from "react-icons/fa";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(4);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tasks = await service.getAllTasks();
      setData(tasks);
      console.log(tasks);
      setTotalRecords(tasks.length);
      setTotalPages(Math.ceil(tasks.length / recordsPerPage));
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

  const handlePageChange = (page, recordsPerPageValue = recordsPerPage) => {
    setCurrentPage(page);
    setRecordsPerPage(recordsPerPageValue);
  };

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
    <div className="m-3 m-sm-5 p-3 p-sm-5">
      <div className="shadow w-100">
        <div
          className="d-sm-flex d-grid bg-secondary-subtle border border-dark justify-content-between align-items-center border p-3"
          style={{ position: "relative" }}
        >
          <div className="d-grid justify-content-center align-items-center p-2 pb-0">
            <span className="d-flex justify-content-center align-items-center gap-2">
              <span
                className="bg-danger d-flex justify-content-center align-items-center rounded-3 text-white"
                style={{ width: "3rem", height: "3rem" }}
              >
                <FaListCheck />
              </span>
              <span className="d-grid d-sm-flex flex-column h-100">
                <h5>Tasks</h5>
                <span>All Tasks</span>
              </span>
            </span>
            <span
              style={{ position: "absolute", bottom: "5px", left: "10px " }}
            >
              {data.length} records
            </span>
          </div>
          <div className="d-grid gap-2 p-2 ">
            <span className="">
              <button
                className="btn text-primary border border-dark bg-light px-2 px-sm-5"
                style={{ borderRadius: "0" }}
                onClick={() => {
                  setIsEditing(false);
                  setTaskModal(true);
                }}
              >
                New Task
              </button>
              <button
                className="btn text-primary border border-dark bg-light px-2 px-sm-5  "
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
                <FaSearch />
              </button>
            </span>
          </div>
        </div>
        <div className="table-responsive-xl border border-secondary">
          <table className="table table-hover ">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Priority</th>
                <th colSpan="2">Comments</th>
              </tr>
            </thead>
            <tbody>
              {dataResult
                .slice(
                  (currentPage - 1) * recordsPerPage,
                  currentPage * recordsPerPage
                )
                .map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
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
                          <Dropdown.Item
                            onClick={() => handleDeleteModal(item)}
                          >
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
      </div>
      <Pagination
        totalRecords={totalRecords}
        recordsPerPage={recordsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        setRecordsPerPage={setRecordsPerPage}
      />
      {deleteModal && (
        <Modal
          show
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header
            closeButton
            className="bg-danger text-white justify-content-center"
            onClick={() => setDeleteModal(false)}
          >
            <Modal.Title id="contained-modal-title-vcenter">Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Do you want to delete task: {deleteTaskName.AssignedTo}?</p>
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
  );
};

const Pagination = ({
  recordsPerPage,
  currentPage,
  onPageChange,
  totalPages,
  setRecordsPerPage,
}) => {
  const handleFirstPage = () => onPageChange(1);
  const handlePrevPage = () => onPageChange(Math.max(currentPage - 1, 1));
  const handleNextPage = () =>
    onPageChange(Math.min(currentPage + 1, totalPages));
  const handleLastPage = () => onPageChange(totalPages);

  const setRecords = (e) => {
    setRecordsPerPage(e.target.value);
  };

  return (
    <div className="d-sm-flex d-grid bg-secondary-subtle border border-dark justify-content-between align-items-center border p-3">
      <div>
        <select
          name="limit"
          id=""
          className="form-select"
          value={recordsPerPage}
          onChange={setRecords}
        >
          <option value="5 ">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>
      </div>

      <div className="d-flex bg-light pagination">
        <li
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className="px-4 p-2 page-item border border-dark page-link"
          style={{ borderRadius: "0" }}
        >
          <FaAngleDoubleUp /> First
        </li>

        <li
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 p-2 page-item border border-dark page-link"
          style={{ borderRadius: "0" }}
        >
          <FaAngleLeft /> Prev
        </li>

        <span className="px-4 p-2 page-item border border-dark active">
          {currentPage}
        </span>

        <li
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 p-2 page-item border border-dark page-link"
          style={{ borderRadius: "0" }}
        >
          <FaAngleRight />
          Next
        </li>

        <li
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className="px-4 p-2 page-item border border-dark page-link"
          style={{ borderRadius: "0" }}
        >
          <FaAngleDoubleDown />
          Last
        </li>
      </div>
    </div>
  );
};

export default TaskList;
