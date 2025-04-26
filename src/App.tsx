
import {BrowserRouter as Router, Routes, Route} from "react-router";

import './App.css'
import { PetQuoteForm } from "./components/PetQuoteForm.tsx";
import {QuoteBuilder} from "./components/QuoteBuilder.tsx";

function App() {

  return (
      <Router>
            <Routes>
                <Route index element={<PetQuoteForm />}/>
                <Route path="build" element={<QuoteBuilder/>}/>
            </Routes>
        </Router>
    // <div className="min-h-screen flex items-center justify-center">
  );
}

export default App
