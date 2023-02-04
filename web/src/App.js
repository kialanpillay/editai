import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";

function App() {
  return (
    <>
      <Router history={history}>
        <div className={"App"}>
          <Routes>
            <Route path="/" element={<Landing />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
