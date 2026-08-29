// Mock "backend" — stands in for a real user database until SAP/API is wired up.
export const seedCustomers = [
  {
    id: "admin",
    name: "Store Admin",
    email: "admin@cuddleco.com",
    password: "admin123",
    phone: "0300 0000000",
    joined: "2026-01-01",
    role: "admin",
  },
  {
    id: "u1",
    name: "Ayesha Khan",
    email: "ayesha@example.com",
    password: "password123",
    phone: "0301 2345678",
    joined: "2026-05-12",
  },
  {
    id: "u2",
    name: "Hassan Raza",
    email: "hassan@example.com",
    password: "password123",
    phone: "0333 1122334",
    joined: "2026-06-02",
  },
  {
    id: "u3",
    name: "Fatima Sheikh",
    email: "fatima@example.com",
    password: "password123",
    phone: "0345 9988776",
    joined: "2026-07-19",
  },
];
