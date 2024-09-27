import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

const TaskForm = ({ show, handleClose, handleSave, taskData, type }) => {
  const [newTask, setNewTask] = useState({
    AssignedTo: "",
    status: "",
    dueDate: "2024-09-24",
    priority: "",
    comments: "",
  });

  useEffect(() => {
    if (taskData) {
      setNewTask(taskData);
    } else {
      setNewTask({
        AssignedTo: "user1",
        status: "Not Started",
        dueDate: "2024-09-24",
        priority: "Low",
        comments: "This Task is Good",
      });
    }
  }, [taskData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = () => {
    handleSave(newTask);
    handleClose();
  };

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header
        className="justify-content-center"
        closeButton
        onClick={handleClose}
      >
        <Modal.Title id="contained-modal-title-vcenter">
          {taskData ? "Edit Task" : "New Task"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">
                <sup className="text-danger">*</sup>Assigned To
              </label>
              <select
                name="AssignedTo"
                value={newTask.AssignedTo}
                onChange={handleChange}
                className="form-select"
              >
                <option value="user1">User1</option>
                <option value="user2">User2</option>
                <option value="user3">User3</option>
                <option value="user4">User4</option>
                <option value="user5">User5</option>
                <option value="user6">User6</option>
                <option value="user7">User7</option>
                <option value="user8">User8</option>
                <option value="user9">User9</option>
                <option value="user10">User10</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">
                <sup className="text-danger">*</sup>Status
              </label>
              <select
                name="status"
                value={newTask.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">
                <sup className="text-danger">*</sup>Priority
              </label>
              <select
                name="priority"
                value={newTask.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Comments</label>
            <textarea
              className="form-control"
              name="comments"
              rows="3"
              value={newTask.comments}
              onChange={handleChange}
            ></textarea>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={onSave}>
          {type}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskForm;
