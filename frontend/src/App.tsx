import React from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import HomeView from './pages/Home/Home.view.tsx';

function App() {
  return (
    <>
      <HomeView/>
      <ToastContainer />
    </>
  );
}

export default App;
