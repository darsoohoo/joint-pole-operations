import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MyTable from './Components/Table'
import { Office365UsersService } from './generated/services/Office365UsersService';

function App() {
  const [count, setCount] = useState(0);
  const [profileName, setProfileName] = useState('there');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await Office365UsersService.MyProfile_V2('id,displayName,jobTitle,userPrincipalName');

        if (result.success && result.data?.displayName) {
          setProfileName(result.data.displayName);
          return;
        }

        console.error('Failed to load Office 365 profile.', result.error);
      } catch (error) {
        console.error('Unexpected error loading Office 365 profile:', error);
      }
    };

    loadProfile();
  }, []);


  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Whatsup {profileName}!
        </p>
      </div>
      <MyTable />
    </>
  )
}

export default App
