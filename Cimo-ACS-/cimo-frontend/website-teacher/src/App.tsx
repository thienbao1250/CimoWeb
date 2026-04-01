import { BrowserRouter } from "react-router-dom";
import "./App.css";
import Container from "./layout/container";
import ThemeRouters from "./routers";

function App() {
  return (
    <BrowserRouter>
      <Container>
        <ThemeRouters />
      </Container>
    </BrowserRouter>
  );
}

export default App;
