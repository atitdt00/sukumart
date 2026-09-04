import Top_Header from "../../Components/layout/Top_Header";
import Header from "../../Components/layout/Header";
import Mobile_Menu from "../../Components/layout/Mobile_Menu";
import Navbar from "../../Components/layout/Navbar";
import Footer from "../../Components/layout/Footer";
import LoginModal from "../../Components/auth/LoginModal";
import SignupModal from "../../Components/auth/SignupModal";
import { ModalProvider } from "../../context/ModalContext";
import { CartProvider } from "../../context/CartContext";
import { AuthProvider } from "../../context/AuthContext";

function layout({ children }) {
  return (
    <div>
      <CartProvider>
        <AuthProvider>
          <ModalProvider>
            <Top_Header />
            <Header />
            <LoginModal />
            <SignupModal />
            <Mobile_Menu />
            <Navbar />
            {children}
            <Footer />
          </ModalProvider>
        </AuthProvider>
      </CartProvider>
    </div>
  );
}

export default layout;
