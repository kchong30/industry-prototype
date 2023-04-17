import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SegmentView from './components/SegmentView';
import CsvInput from './components/CsvInput';
import FilterField from './components/FilterField'


function App() {
  return (
    <div className="App">
    <CsvInput />
    <FilterField />
    <SegmentView />
     </div>

  )
}

export default App
