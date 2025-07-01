import Header from './components/Header';
import Home from './components/Home';
import { useState } from 'react';
import PostView from './components/PostView';

function App() {
  let [element, updatePage] = useState({id: 0, count: 0});

  return (
    <div>
      <Header onScreenChange={(element : {id: number, title: string}) => updatePage(element)}/>

      {getSelectedWindow(element)}
    </div>
  );
}

function getSelectedWindow(element: {id: number, title: String}, updatePage: (newElement: {id: number, count: number}) => void) {
  let updater = (newElement: {id: number, count: number}) => updatePage(newElement);
  let windows = [
    <Home onScreenChange={updater}/>,
    <Blog onScreenChange={updater}/>,
    <PostView title={title} onScreenChange={updater} />
  ]

  return windows[element.id]
}

export default App;