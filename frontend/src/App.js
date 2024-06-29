// File path: frontend/src/App.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, Table } from "react-bootstrap";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [editingRow, setEditingRow] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/contacts");
      setContacts(res.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      alert("There was an error fetching contacts. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRowChange = (e, id) => {
    const { name, value } = e.target;
    const updatedContacts = contacts.map((contact) =>
      contact.id === id ? { ...contact, [name]: value } : contact
    );
    setContacts(updatedContacts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/api/contacts", form);
      setForm({ name: "", email: "", phone: "" });
      fetchContacts();
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("There was an error submitting the form. Please try again.");
    }
  };

  const handleEdit = (contact) => {
    setEditingRow(contact.id);
  };

  const handleSave = async (id) => {
    const contact = contacts.find((contact) => contact.id === id);
    try {
      await axios.put(`http://localhost:3001/api/contacts/${id}`, contact);
      setEditingRow(null);
      fetchContacts();
    } catch (error) {
      console.error("Error saving contact:", error);
      alert("There was an error saving the contact. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/contacts/${id}`);
      fetchContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("There was an error deleting the contact. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <h1>Contact Management System</h1>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="formName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter name"
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </Form.Group>

        <Form.Group controlId="formPhone" className="mt-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Add Contact
        </Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>
                {editingRow === contact.id ? (
                  <Form.Control
                    type="text"
                    name="name"
                    value={contact.name}
                    onChange={(e) => handleRowChange(e, contact.id)}
                  />
                ) : (
                  contact.name
                )}
              </td>
              <td>
                {editingRow === contact.id ? (
                  <Form.Control
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={(e) => handleRowChange(e, contact.id)}
                  />
                ) : (
                  contact.email
                )}
              </td>
              <td>
                {editingRow === contact.id ? (
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={contact.phone}
                    onChange={(e) => handleRowChange(e, contact.id)}
                  />
                ) : (
                  contact.phone
                )}
              </td>
              <td>
                {editingRow === contact.id ? (
                  <Button
                    variant="success"
                    onClick={() => handleSave(contact.id)}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="warning"
                    onClick={() => handleEdit(contact)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="danger"
                  onClick={() => handleDelete(contact.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default App;
