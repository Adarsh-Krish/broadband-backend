const { v4: uuidv4 } = require("uuid");

let leads = [
  {
    id: uuidv4(),
    business: "Cafe Nero",
    contactName: "John Smith",
    email: "john@cafenero.co.uk",
    phone: "07700900001",
    address: "1 High Street, London",
    postcode: "SW1A 1AA",
    partner: "square",
    package: "BT Business",
    status: "New",
    date: "2024-01-15",
    commission: 0,
  },
  {
    id: uuidv4(),
    business: "Burger Hub",
    contactName: "Sara Lee",
    email: "sara@burgerhub.co.uk",
    phone: "07700900002",
    address: "22 Canary Wharf, London",
    postcode: "E14 5AB",
    partner: "square",
    package: "CityFibre",
    status: "Closed",
    date: "2024-01-12",
    commission: 150,
  },
  {
    id: uuidv4(),
    business: "Tech Studio",
    contactName: "Ali Khan",
    email: "ali@techstudio.co.uk",
    phone: "07700900003",
    address: "5 Silicon Road, London",
    postcode: "EC2A 4BX",
    partner: "apex",
    package: "Virgin Business",
    status: "Contacted",
    date: "2024-01-10",
    commission: 0,
  },
];

const getAll = () => leads;
const getById = (id) => leads.find((l) => l.id === id);
const getByPartner = (slug) => leads.filter((l) => l.partner === slug);
const create = (data) => {
  const lead = {
    id: uuidv4(),
    ...data,
    status: "New",
    date: new Date().toISOString().split("T")[0],
    commission: 0,
  };
  leads.push(lead);
  return lead;
};
const updateStatus = (id, status) => {
  const lead = leads.find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  if (status === "Closed") lead.commission = 150;
  return lead;
};

module.exports = { getAll, getById, getByPartner, create, updateStatus };
