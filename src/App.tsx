import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  TrendingUp,
  Gauge,
  DollarSign,
  Fuel,
  Plus,
  Car,
  Truck,
  Bike,
  LayoutDashboard,
  PlusCircle,
  BarChart2,
  History,
  FileText,
  Download,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const vehicles = [
  {
    id: 1,
    name: "Honda Civic 2022",
    type: "Sedan",
    fuelType: "Gasoline",
    icon: "car",
  },
  {
    id: 2,
    name: "Ford F-150 2021",
    type: "Truck",
    fuelType: "Diesel",
    icon: "truck",
  },
  {
    id: 3,
    name: "Yamaha MT-07",
    type: "Motorcycle",
    fuelType: "Gasoline",
    icon: "bike",
  },
];
const API_URL =
  "https://fuel-tracker-y5s4.onrender.com/api";

const tabs = [
  { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "Add Entry", label: "Add Entry", icon: PlusCircle },
  { id: "Analytics", label: "Analytics", icon: BarChart2 },
  { id: "History", label: "History", icon: History },
  { id: "Reports", label: "Reports", icon: FileText },
  { id: "Export", label: "Export", icon: Download },
  { id: "Settings", label: "Settings", icon: Settings },
  { id: "Logout", label: "Logout", icon: LogOut },
];

const CHART_COLORS = ["#3b82f6", "#10b981", "#f97316"];

function VehicleIcon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  if (name === "truck") return <Truck size={size} />;
  if (name === "bike") return <Bike size={size} />;
  return <Car size={size} />;
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="p-5 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 uppercase">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>

      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    </Card>
  );
}

export default function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [activeTab, setActiveTab] =
    useState("Dashboard");

  const [fuelEntries, setFuelEntries] = useState<any[]>(
    []
  );

  const [selectedVehicle, setSelectedVehicle] =
    useState<number | null>(1);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    fuelAmount: "",
    cost: "",
    odometer: "",
    vehicleId: 1,
  });

  useEffect(() => {
    if (token) {
      fetchEntries();
    }
  }, [token]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      setToken(response.data.token);

      alert("Login successful");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/fuel-entries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFuelEntries(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddEntry = async () => {
    try {
      await axios.post(
        `${API_URL}/fuel-entries`,
        {
          vehicle_name:
            vehicles.find(
              (v) => v.id == formData.vehicleId
            )?.name || "",

          date: formData.date,

          fuel_amount: Number(formData.fuelAmount),

          cost: Number(formData.cost),

          odometer: Number(formData.odometer),

          mpg: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchEntries();

      setFormData({
        date: new Date()
          .toISOString()
          .split("T")[0],
        fuelAmount: "",
        cost: "",
        odometer: "",
        vehicleId: 1,
      });

      alert("Fuel entry added!");
    } catch (error) {
      console.error(error);
      alert("Failed to save entry");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <Card className="p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            FuelTrack Login
          </h1>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-md px-4 py-3"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-md px-4 py-3"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const filteredEntries = selectedVehicle
    ? fuelEntries.filter(
        (e) =>
          e.vehicle_name ===
          vehicles.find(
            (v) => v.id === selectedVehicle
          )?.name
      )
    : fuelEntries;

  const totalFuel = filteredEntries.reduce(
    (sum, entry) =>
      sum + Number(entry.fuel_amount),
    0
  );

  const totalCost = filteredEntries.reduce(
    (sum, entry) => sum + Number(entry.cost),
    0
  );

  const avgCostPerLiter =
    totalFuel > 0 ? totalCost / totalFuel : 0;

  const fuelByVehicle = vehicles.map((v) => {
    const entries = fuelEntries.filter(
      (e) => e.vehicle_name === v.name
    );

    return {
      name: v.name,
      value: entries.reduce(
        (sum, e) =>
          sum + Number(e.fuel_amount),
        0
      ),
    };
  });

  const analyticsData = fuelEntries.map(
    (entry) => ({
      date: entry.date,
      cost:
        entry.fuel_amount > 0
          ? entry.cost / entry.fuel_amount
          : 0,
    })
  );

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 h-14">

            <div className="flex items-center gap-2">
              <Fuel size={20} />
              <span className="font-bold">
                FuelTrack
              </span>
            </div>

            <nav className="flex gap-2 overflow-x-auto">
              {tabs.map(
                ({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      if (id === "Logout") {
                        handleLogout();
                      } else {
                        setActiveTab(id);
                      }
                    }}
                    className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 ${
                      activeTab === id
                        ? "bg-white text-blue-600"
                        : "hover:bg-blue-500"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                )
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">

  {activeTab === "Dashboard" && (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        label="Total Fuel"
        value={`${totalFuel.toFixed(1)} L`}
        icon={<Fuel size={20} />}
        color="bg-blue-100"
      />

      <StatCard
        label="Total Cost"
        value={`$${totalCost.toFixed(2)}`}
        icon={<DollarSign size={20} />}
        color="bg-orange-100"
      />

      <StatCard
        label="Average Cost/L"
        value={`$${avgCostPerLiter.toFixed(2)}`}
        icon={<Gauge size={20} />}
        color="bg-green-100"
      />

      <StatCard
        label="Entries"
        value={`${fuelEntries.length}`}
        icon={<TrendingUp size={20} />}
        color="bg-purple-100"
      />
    </div>
  )}

  {activeTab === "Add Entry" && (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">
        Add Fuel Entry
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInput}
          className="border rounded-md px-3 py-2"
        />

        <select
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleInput}
          className="border rounded-md px-3 py-2"
        >
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="fuelAmount"
          placeholder="Fuel Amount"
          value={formData.fuelAmount}
          onChange={handleInput}
          className="border rounded-md px-3 py-2"
        />

        <input
          type="number"
          name="cost"
          placeholder="Cost"
          value={formData.cost}
          onChange={handleInput}
          className="border rounded-md px-3 py-2"
        />

        <input
          type="number"
          name="odometer"
          placeholder="Odometer"
          value={formData.odometer}
          onChange={handleInput}
          className="border rounded-md px-3 py-2"
        />
      </div>

      <button
        onClick={handleAddEntry}
        className="mt-5 bg-blue-600 text-white px-5 py-3 rounded-md"
      >
        Add Entry
      </button>
    </Card>
  )}

  {activeTab === "Analytics" && (
    <div className="grid grid-cols-2 gap-6">

      <Card className="p-6">
        <h2 className="font-semibold mb-4">
          Fuel Distribution
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={fuelByVehicle}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              {fuelByVehicle.map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    CHART_COLORS[
                      i % CHART_COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold mb-4">
          Cost per Liter Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="cost"
              stroke="#3b82f6"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

    </div>
  )}

  {activeTab === "History" && (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Fuel</th>
              <th className="p-3">Cost</th>
              <th className="p-3">Odometer</th>
            </tr>
          </thead>

          <tbody>
            {fuelEntries.map((entry) => (
              <tr key={entry.id}>
                <td className="p-3">{entry.date}</td>
                <td className="p-3">{entry.vehicle_name}</td>
                <td className="p-3">{entry.fuel_amount}</td>
                <td className="p-3">${entry.cost}</td>
                <td className="p-3">{entry.odometer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )}

  {activeTab === "Reports" && (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Reports
      </h2>

      <p>Total Fuel Used: {totalFuel.toFixed(2)} L</p>
      <p>Total Cost: ${totalCost.toFixed(2)}</p>
      <p>Average Cost/L: ${avgCostPerLiter.toFixed(2)}</p>
    </Card>
  )}

  {activeTab === "Export" && (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Export Data
      </h2>

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Export CSV
      </button>
    </Card>
  )}

  {activeTab === "Settings" && (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Settings
      </h2>

      <p>Application settings will appear here.</p>
    </Card>
  )}

      </main>
    </div>
  );
}