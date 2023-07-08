const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

async function listContacts() {
  const allContacts = await fs.readFile(contactsPath);
  return JSON.parse(allContacts);
}

async function getContactById(contactId) {
  const contacts = await listContacts();

  const result = contacts.find((contact) => contact.id === contactId);

  return result || null;
}

async function addContact({ name, email, phone }) {
  const contacts = await listContacts();

  const newConatct = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  contacts.push(newConatct);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newConatct;
}

async function removeContact(contactId) {
  const contacts = await listContacts();

  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const [result] = contacts.splice(index, 1);

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

async function updateContact(id, data) {
  const contacts = await listContacts();

  const index = contacts.findIndex((contact) => contact.id === id);

  if (index === -1) {
    return null;
  }

  contacts[index] = { id, ...data };

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
}
module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
