import Footer from "./components/Footer/Footer";
import GuestResve from "./pages/GuestResve/GuestResve";
import Header from "./components/Header/Header";
import HostResve from "./pages/HostResve/HostResve";
import Main from "./components/Main/Main";
import Modal from "./components/Modal/Modal";
import TopButton from "./components/TopButton/TopButton";
import "./index.css";

export default function App() {
  return (
    <>
      <Header />
      <Main />
      {/* 예약정보 (reservationId) 필요 */}
      <Footer />
      <TopButton />
    </>
  );
}
