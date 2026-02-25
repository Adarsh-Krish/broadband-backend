const { v4: uuidv4 } = require("uuid");

let partners = [
  {
    id: uuidv4(),
    name: "Square Solutions",
    slug: "square",
    commission: 15,
    status: "Active",
  },
  {
    id: uuidv4(),
    name: "Apex Digital",
    slug: "apex",
    commission: 12,
    status: "Active",
  },
  {
    id: uuidv4(),
    name: "BlueSky Referrals",
    slug: "bluesky",
    commission: 10,
    status: "Inactive",
  },
];

const getAll = () => partners;
const getBySlug = (slug) => partners.find((p) => p.slug === slug);
const create = (data) => {
  const partner = { id: uuidv4(), ...data, status: "Active" };
  partners.push(partner);
  return partner;
};
const remove = (id) => {
  const index = partners.findIndex((p) => p.id === id);
  if (index === -1) return false;
  partners.splice(index, 1);
  return true;
};

module.exports = { getAll, getBySlug, create, remove };
