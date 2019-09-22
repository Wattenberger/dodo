import React, { useMemo } from 'react';
import GoogleAuth from './GoogleAuth'
import FirebaseWrapper from './FirebaseWrapper'
import Events from 'components/Events/Events'
import Tasks from 'components/Tasks/Tasks'

import './App.scss'
import './styles/global.scss'

function App() {
  return (
    <div className="App">
      <GoogleAuth>
        <FirebaseWrapper>
          <div className="App__wrapper">
            <Events />
            <div className="App__wrapper__tasks">
              <Tasks />
            </div>
          </div>
        </FirebaseWrapper>
      </GoogleAuth>
    </div>
  );
}

export default App;
