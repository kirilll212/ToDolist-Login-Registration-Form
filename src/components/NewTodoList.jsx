import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
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

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAddTodo = async () => {
    if (inputValue.trim() !== '') {
      if (editIndex !== null) {
        const editedTodoId = Object.keys(todos)[editIndex];
        const editedTodo = todos[editedTodoId];

        if (editedTodo) {
          const updatedTodo = {
            ...editedTodo,
            text: inputValue,
          };

          const updatedTodos = {
            ...todos,
            [editedTodoId]: updatedTodo,
          };

          queryClient.setQueryData('todos', updatedTodos);

          setInputValue('');
          setEditIndex(null);

          localStorage.setItem('todos', JSON.stringify(updatedTodos));
        }
      } else {
        const newTodoId = generateUniqueId();

        const newTodo = {
          id: Math.floor(Math.random()),
          text: inputValue,
          completed: false,
          createdBy: loggedInUser,
          userId: 1,
        };

        const updatedTodos = {
          ...todos,
          [newTodoId]: newTodo,
        };

        queryClient.setQueryData('todos', updatedTodos);

        setInputValue('');

        localStorage.setItem('todos', JSON.stringify(updatedTodos));

        try {
          const response = await fetch('https://dummyjson.com/todos/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo),
          });

          if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error adding todo:', errorResponse);
            throw new Error('Error adding todo');
          }

          const data = await response.json();
          const updatedTodo = {
            id: data.id,
            text: data.todo,
            completed: data.completed,
            createdBy: loggedInUser,
          };

          const updatedTodosAfterServer = {
            ...updatedTodos,
            [updatedTodo.id]: updatedTodo,
          };

          queryClient.setQueryData('todos', updatedTodosAfterServer);
          localStorage.setItem('todos', JSON.stringify(updatedTodosAfterServer));
        } catch (error) {
          console.error('Error adding todo:', error);
        }
      }
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
    const updatedCompletedTodos = { ...completedTodos };
    const todo = updatedTodos[todoId];

    if (todo) {
      const updatedTodo = {
        ...todo,
        completed: !todo.completed,
      };

      updatedTodos[todoId] = updatedTodo;

      if (updatedTodo.completed) {
        updatedCompletedTodos[todoId] = true;
      } else {
        delete updatedCompletedTodos[todoId];
      }

      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedTodos));

      queryClient.setQueryData('todos', updatedTodos);
      queryClient.setQueryData('completedTodos', updatedCompletedTodos);

      fetch(`https://dummyjson.com/todos/${todoId}`, {
        method: 'PUT', /* or PATCH */
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: updatedTodo.completed,
        }),
      })
        .then(res => res.json())
        .then(data => {
          console.log('Todo updated:', data);
        })
        .catch(error => {
          console.error('Error updating todo:', error);
        });
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