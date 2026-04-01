import { BrowserRouter, BrowserRouter as Router } from "react-router-dom";
import Container from "./layout/ParentLayout/container";
import AppWithRouter from "./routers";
import "./App.css";
import { useState } from "react";
import useAuth from "./hooks/useAuth";
import BottomNav from "./ui-components/BottomNav/BottomNav";
import Loader from "./ui-components/Loader";
import ThemeRoutes from "./routers";

function App() {
  const [hideNav, setHideNav] = useState(false);
  const { isInitialized } = useAuth();

  if (!isInitialized) return <Loader />;

  return (
    // <Router>
    //   <Container>
    //     <AppWithRouter setHideNav={setHideNav} />
    //     {!hideNav && <BottomNav />}
    //   </Container>
    // </Router>
    <BrowserRouter>
      <ThemeRoutes />
    </BrowserRouter>
  );
}

export default App;
