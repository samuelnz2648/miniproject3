// frontend/src/App.js

import React, { useContext, useState } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import { ContactContext } from "./ContactContext";

const App = () => {
  const { contacts, addContact, updateContact, deleteContact } =
    useContext(ContactContext);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [editingRow, setEditingRow] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRowChange = (e, id) => {
    const { name, value } = e.target;
    const updatedContacts = contacts.map((contact) =>
      contact.id === id ? { ...contact, [name]: value } : contact
    );
    const contact = updatedContacts.find((contact) => contact.id === id);
    console.log("Row Change:", { id, contact });
    updateContact(id, contact);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", form);
    await addContact(form);
    setForm({ name: "", email: "", phone: "" });
  };

  const handleEdit = (contact) => {
    console.log("Editing contact:", contact);
    setEditingRow(contact.id);
  };

  const handleSave = (id) => {
    const contact = contacts.find((contact) => contact.id === id);
    console.log("Saving contact:", { id, contact });
    updateContact(id, contact);
    setEditingRow(null);
  };

  const handleDelete = (id) => {
    console.log("Deleting contact:", id);
    deleteContact(id);
  };

  console.log("Rendered contacts:", contacts);

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
