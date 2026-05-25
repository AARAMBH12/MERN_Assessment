import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import CompanyList from "./pages/CompanyList";
import CompanyDetail from "./pages/CompanyDetail";
import AddCompany from "./pages/AddCompany";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e1e1e",
            color: "#f0ede8",
            border: "1px solid #2a2a2a",
            fontFamily: "'DM Sans', sans-serif",
          },
          success: { iconTheme: { primary: "#f5c518", secondary: "#000" } },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<CompanyList />} />
        <Route path="/companies/new" element={<AddCompany />} />
        <Route path="/companies/:id" element={<CompanyDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
