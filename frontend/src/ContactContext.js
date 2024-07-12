// frontend/src/ContactContext.js

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ContactContext = createContext();

const ContactProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      console.log("Fetching contacts");
      const res = await axios.get("http://localhost:3001/api/contacts");
      setContacts(res.data);
      console.log("Fetched contacts:", res.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      alert("There was an error fetching contacts. Please try again.");
    }
  };

  const addContact = async (form) => {
    try {
      console.log("Adding contact:", form);
      const res = await axios.post("http://localhost:3001/api/contacts", form);
      const newContacts = [...contacts, res.data];
      console.log("New contacts list after adding:", newContacts);
      setContacts(newContacts);
      console.log("Added contact:", res.data);
    } catch (error) {
      console.error("Error adding contact:", error);
      alert("There was an error adding the contact. Please try again.");
    }
  };

  const updateContact = async (id, updatedContact) => {
    try {
      console.log("Updating contact:", { id, updatedContact });
      await axios.put(
        `http://localhost:3001/api/contacts/${id}`,
        updatedContact
      );
      fetchContacts();
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("There was an error updating the contact. Please try again.");
    }
  };

  const deleteContact = async (id) => {
    try {
      console.log("Deleting contact with id:", id);
      await axios.delete(`http://localhost:3001/api/contacts/${id}`);
      fetchContacts();
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
