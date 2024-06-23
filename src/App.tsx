import React from 'react';
import DatePicker from './DatePicker';
import './App.css';

const App: React.FC = () => {
  const handleDateChange = (selectedDates: { startDate: Date | null, endDate: Date | null}, weekends: Date[]) => {
    console.log('FB check selected dates -->', selectedDates);
    console.log('FB check weekend dates -->', weekends);
  }

  const predefinedDateRanges = [
    {
      label: 'Last 7 Days',
      range: {
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        endDate: new Date()
      }
    },
    {
      label: 'Last 30 Days',
      range: {
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date()
      }
    }
  ];

  return (
    <div className='App'>
      <h1>WEEKDAY DATE RANGE PICKER</h1>
      <DatePicker onChange={handleDateChange} predefinedDateRanges={predefinedDateRanges} />
    </div>
  )
}

export default App;