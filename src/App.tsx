import Header from './components/Header';
import Home from './components/Home';
import { useState } from 'react';

function App() {
  let [selectedWindow, updatePage] = useState(<Home/>);

  addEventListener("screenChange", (e: Event) => {
    updatePage((e as CustomEvent).detail);
  });

  return (
    <div>
      <Header/>

      {selectedWindow}
    </div>
  );
}

export default App;