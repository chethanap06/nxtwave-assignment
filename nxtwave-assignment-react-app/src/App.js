import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Include appropriate CSS for responsiveness

const API_URL = "https://apis.ccbp.in/list-creation/lists"; // Replace with the correct API URL

const App = () => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedLists, setSelectedLists] = useState([]);
  const [isListCreationView, setIsListCreationView] = useState(false);
  const [newList, setNewList] = useState([]);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(API_URL);
      // Validate response and set lists
      if (response.data && Array.isArray(response.data.lists)) {
        setLists(response.data.lists);
      } else {
        throw new Error("Invalid API response");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching lists:", err);
      setError(true);
      setLoading(false);
    }
  };

  const handleListSelect = (listNumber) => {
    if (selectedLists.includes(listNumber)) {
      setSelectedLists(selectedLists.filter((num) => num !== listNumber));
    } else {
      setSelectedLists([...selectedLists, listNumber]);
    }
  };

  const handleCreateNewList = () => {
    if (selectedLists.length !== 2) {
      alert("You should select exactly 2 lists to create a new list");
      return;
    }
    setIsListCreationView(true);
  };

  const moveItem = (item, fromList, toList) => {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list.list_number === fromList) {
          return {
            ...list,
            items: list.items.filter((i) => i.id !== item.id),
          };
        } else if (list.list_number === toList) {
          return {
            ...list,
            items: [...list.items, item],
          };
        }
        return list;
      })
    );
  };

  const handleCancel = () => {
    setIsListCreationView(false);
    setNewList([]);
  };

  const handleUpdate = () => {
    setIsListCreationView(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        <p>Something went wrong. Please try again.</p>
        <button onClick={fetchLists}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      {!isListCreationView ? (
        <div>
          <h1><mid>List Creation</mid></h1>
          <button onClick={handleCreateNewList}>Create a new list</button>
          <div className="lists-container">
            {Array.isArray(lists) && lists.length > 0 ? (
              <div className="list-columns">
                <div className="list-column">
                  <h3>List 1</h3>
                  {lists
                    .filter((item) => item.list_number === 1)
                    .map((item) => (
                      <div key={item.id} className="list-item">
                        <input
                          type="checkbox"
                          onChange={() => handleListSelect(item)}
                          checked={selectedLists.some((i) => i.id === item.id)}
                        />
                        <ul>
                        <li><b>{item.name}</b></li>
                          <li>{item.description}</li>
                        </ul>
                      </div>
                    ))}
                </div>
  
                <div className="list-column">
                  <h3>List 2</h3>
                  {lists
                    .filter((item) => item.list_number === 2)
                    .map((item) => (
                      <div key={item.id} className="list-item">
                        <input
                          type="checkbox"
                          onChange={() => handleListSelect(item)}
                          checked={selectedLists.some((i) => i.id === item.id)}
                        />
                        <ul>
                          <li><b>{item.name}</b></li>
                          <li>{item.description}</li>
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <p>No lists available</p>
            )}
          </div>
        </div>
      ) : (
        <div>
        <h1>Selected Items</h1>
        <div className="selected-items-container">
          {selectedLists.map((item) => (
            <div key={item.id} className="selected-item">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleUpdate}>Update</button>
      </div>
    )}
  </div>
  );
};

export default App;
