import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

const NewTodoList = () => {
  const [todos, setTodos] = useState({});
  const [completedTodos, setCompletedTodos] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    const storedCompletedTodos = localStorage.getItem('completedTodos');

    setTodos(JSON.parse(storedTodos) || {});
    setCompletedTodos(JSON.parse(storedCompletedTodos) || {});
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
  }, [todos, completedTodos]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      if (editIndex !== null) {
        const todoId = Object.keys(todos)[editIndex];
        const updatedTodos = { ...todos };
        updatedTodos[todoId] = {
          text: inputValue,
          createdBy: loggedInUser,
        };
        setTodos(updatedTodos);
        setEditIndex(null);
      } else {
        const userId = loggedInUser.id;
        const todoId = `${userId}_${generateUniqueId()}`;
        const updatedTodos = {
          ...todos,
          [todoId]: {
            text: inputValue,
            createdBy: loggedInUser,
          },
        };
        setTodos(updatedTodos);
      }
      setInputValue('');
    }
  };

  const handleEditTodo = (index) => {
    setInputValue(todos[index].text);
    setEditIndex(index);
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = { ...todos };
    delete updatedTodos[index];
    setTodos(updatedTodos);
    removeCompleted(index);
  };

  const handleToggleTodo = (index) => {
    const updatedCompletedTodos = { ...completedTodos };
    if (completedTodos[index]) {
      delete updatedCompletedTodos[index];
    } else {
      updatedCompletedTodos[index] = true;
    }
    setCompletedTodos(updatedCompletedTodos);
  };

  const removeCompleted = (index) => {
    const updatedCompletedTodos = { ...completedTodos };
    delete updatedCompletedTodos[index];
    setCompletedTodos(updatedCompletedTodos);
  };

  const isTodoCompleted = (index) => {
    return completedTodos[index];
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const filteredTodos = Object.entries(todos).filter(([todoId, todo]) => {
    const { createdBy } = todo;
    if (activeTab === 'all') {
      return createdBy === loggedInUser;
    } else if (activeTab === 'active') {
      return createdBy === loggedInUser && !completedTodos[todoId];
    } else if (activeTab === 'completed') {
      return createdBy === loggedInUser && completedTodos[todoId];
    }
    return false;
  });

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="my-4">Todo List</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter what you need to be done!"
        />
        <button className="btn btn-primary" onClick={handleAddTodo}>
          {editIndex !== null ? 'Save' : 'Add'}
        </button>
      </div>
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            All
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => handleTabChange('active')}
          >
            Active
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === 'completed' ? 'active' : ''
            }`}
            onClick={() => handleTabChange('completed')}
          >
            Completed
          </button>
        </li>
      </ul>
      <ul className="list-group">
        {filteredTodos.map(([todoId, todo]) => {
          const { text, createdBy } = todo; // Отримуємо ім'я користувача, який створив тудушку

          return (
            <li
              key={todoId}
              className={`list-group-item d-flex justify-content-between align-items-center ${
                isTodoCompleted(todoId) ? 'completed' : ''
              }`}
            >
              <label className="form-check-label" htmlFor={`checkbox-${todoId}`}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`checkbox-${todoId}`}
                  checked={isTodoCompleted(todoId)}
                  onChange={() => handleToggleTodo(todoId)}
                />
                <span>{text}</span>
              </label>
              <div>
                <div className="todo-creator text-muted">
                  Created by: {createdBy}
                </div>
                {editIndex === todoId ? (
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={handleAddTodo}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEditTodo(todoId)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteTodo(todoId)}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NewTodoList;
