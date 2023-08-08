import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import './style.css';

const NewTodoList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const fetchTodos = async () => {
    const storedTodos = localStorage.getItem('todos');
    return JSON.parse(storedTodos) || {};
  };
  
  const fetchCompletedTodos = async () => {
    const storedCompletedTodos = localStorage.getItem('completedTodos');
    return JSON.parse(storedCompletedTodos) || {};
  };
  
  const fetchLoggedInUser = async () => {
    const storedLoggedInUser = localStorage.getItem('loggedInUser');
    return storedLoggedInUser || '';
  };

  const { data: todos } = useQuery('todos', fetchTodos);
  const { data: completedTodos } = useQuery('completedTodos', fetchCompletedTodos);
  const { data: loggedInUser } = useQuery('loggedInUser', fetchLoggedInUser);
  
  const addTodoMutation = useMutation(
    async (newTodo) => {
      const updatedTodos = {
        ...todos,
        [newTodo.id]: newTodo,
      };
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData('todos', data);
      },
    }
  );

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddTodo = async () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: generateUniqueId(),
        text: inputValue,
        completed: false,
        createdBy: loggedInUser,
      };
      await addTodoMutation.mutateAsync(newTodo);
      setInputValue('');
    }
  };

  const handleEditTodo = (todoId) => {
    const editedTodo = todos[todoId];

    if (editedTodo) {
      setInputValue(editedTodo.text);
      setEditIndex(todoId);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    const updatedTodos = { ...todos };
    delete updatedTodos[todoId];
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
    queryClient.setQueryData('todos', updatedTodos);
  };

  const handleToggleTodo = async (todoId) => {
    const updatedTodos = { ...todos };
    const todo = updatedTodos[todoId];

    if (todo) {
      const updatedTodo = {
        ...todo,
        completed: !todo.completed,
      };

      updatedTodos[todoId] = updatedTodo;
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      queryClient.setQueryData('todos', updatedTodos);
    }
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

  const filteredTodos = todos ? Object.entries(todos).filter(([todoId, todo]) => {
    const { createdBy } = todo;
    if (activeTab === 'all') {
      return true;
    } else if (activeTab === 'active') {
      return createdBy && !completedTodos[todoId];
    } else if (activeTab === 'completed') {
      return createdBy && completedTodos[todoId];
    }
    return false;
  }) : [];

  return (
    <div className="container mt-5 shadow-lg p-4 rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">Todo List</h2>
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
      <ul className="nav nav-tabs">
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
            className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => handleTabChange('completed')}
          >
            Completed
          </button>
        </li>
      </ul>
      <ul className="list-group mt-3">
        {filteredTodos.map(([todoId, todo]) => {
          const { text, createdBy, completed } = todo;

          return (
            <li
              key={todoId}
              className={`list-group-item d-flex justify-content-between align-items-center ${completed ? 'list-group-item-success' : ''
                }`}
            >
              <label className="form-check-label" htmlFor={`checkbox-${todoId}`}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`checkbox-${todoId}`}
                  checked={completed}
                  onChange={() => handleToggleTodo(todoId)}
                />
                <span className="ms-2">{text}</span>
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