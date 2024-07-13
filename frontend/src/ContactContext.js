// frontend/src/ContactContext.js

import React, { createContext, useReducer, useEffect } from "react";
import axios from "axios";

export const ContactContext = createContext();

const initialState = [];

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_CONTACTS":
      return action.payload;
    case "ADD_CONTACT":
      return [...state, action.payload];
    case "UPDATE_CONTACT":
      return state.map((contact) =>
        contact.id === action.payload.id ? action.payload : contact
      );
    case "DELETE_CONTACT":
      return state.filter((contact) => contact.id !== action.payload);
    default:
      return state;
  }
};

const ContactProvider = ({ children }) => {
  const [contacts, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/contacts");
      dispatch({ type: "FETCH_CONTACTS", payload: res.data });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      alert("There was an error fetching contacts. Please try again.");
    }
  };

  const addContact = async (form) => {
    try {
      const res = await axios.post("http://localhost:3001/api/contacts", form);
      dispatch({ type: "ADD_CONTACT", payload: res.data });
    } catch (error) {
      console.error("Error adding contact:", error);
      alert("There was an error adding the contact. Please try again.");
    }
  };

  const updateContact = async (id, updatedContact) => {
    try {
      await axios.put(
        `http://localhost:3001/api/contacts/${id}`,
        updatedContact
      );
      dispatch({ type: "UPDATE_CONTACT", payload: updatedContact });
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("There was an error updating the contact. Please try again.");
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/contacts/${id}`);
      dispatch({ type: "DELETE_CONTACT", payload: id });
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("There was an error deleting the contact. Please try again.");
    }
  };

  return (
    <ContactContext.Provider
      value={{ contacts, addContact, updateContact, deleteContact }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export default ContactProvider;
