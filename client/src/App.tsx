import './App.css'
import { useEffect, useState } from 'react'
import myLogo from './assets/react.svg'
import Button from './Button.tsx'

function App() {

  const [groupCount, setgroupCount] = useState<number>(0);

  useEffect(() => {
    const fetchBoxes = async () => {
      try {
        const response = await fetch('http://localhost:8000/count');
        const data = await response.json();

        setgroupCount(data.count);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchBoxes();
  }, []);

  return (
    // Right Column
    <div className="flex flex-row w-full">
    <div className="flex flex-col items-center min-h-screen gap-0 bg-green-850 w-21">
      <a className="py-2" href="index.html">
        <img src={myLogo} alt="Uh Oh!" className="w-15 h-20"/>
      </a>
      <Button text="Dashboard" icon={myLogo}/>
      <Button text="Browse" icon={myLogo}/>
    </div>
    <div className="flex flex-col min-h-screen bg-white w-full pl-12">
      <div className='flex flex-row justify-between items-center gap-120 pt-8 w-full h-25
      border-b border-gray-300 pb-8
      '>
        <span className='text-4xl font-semibold'>Dashboard</span>
        <Button text="Test" icon={myLogo}/>
      </div>
      <div className='flex flex-row min-h-screen w-full pt-6 gap-10'>
        {/* Group Cards */}
        {Array.from({length: groupCount}).map((_, index) => (
          <div key={index} className='w-65 h-66 bg-blue-200 rounded-md hover:bg-blue-300 transition-colors duration-300'>
            <p className='p-4'>Box #{index+1}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}

export default App
