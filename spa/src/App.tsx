import React from 'react';
import './App.scss';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Transactions from './components/transactions/Transactions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/*"
          element={
            <Transactions />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
