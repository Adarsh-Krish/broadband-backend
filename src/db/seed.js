require("dotenv").config();
const connectDB = require("./connect");
const Partner = require("../models/Partner");
const Lead = require("../models/Lead");

const seed = async () => {
  await connectDB();

  await Partner.deleteMany({});
  await Lead.deleteMany({});

  await Partner.insertMany([
    {
      name: "Square Solutions",
      slug: "square",
      commission: 15,
      status: "Active",
    },
    { name: "Apex Digital", slug: "apex", commission: 12, status: "Active" },
    {
      name: "BlueSky Referrals",
      slug: "bluesky",
      commission: 10,
      status: "Inactive",
    },
  ]);

  await Lead.insertMany([
    {
      business: "Cafe Nero",
      contactName: "John Smith",
      email: "john@cafenero.co.uk",
      phone: "07700900001",
      address: "1 High Street",
      postcode: "SW1A 1AA",
      partner: "square",
      package: "BT Business",
      status: "New",
      commission: 0,
    },
    {
      business: "Burger Hub",
      contactName: "Sara Lee",
      email: "sara@burgerhub.co.uk",
      phone: "07700900002",
      address: "22 Canary Wharf",
      postcode: "E14 5AB",
      partner: "square",
      package: "CityFibre",
      status: "Closed",
      commission: 150,
    },
    {
      business: "Tech Studio",
      contactName: "Ali Khan",
      email: "ali@techstudio.co.uk",
      phone: "07700900003",
      address: "5 Silicon Road",
      postcode: "EC2A 4BX",
      partner: "apex",
      package: "Virgin Business",
      status: "Contacted",
      commission: 0,
    },
  ]);

  console.log("✅ Database seeded!");
  process.exit(0);
};

seed();
