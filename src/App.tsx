import Header from './components/Header';
import Home from './components/Home';
import { Dispatch, SetStateAction, useState } from 'react';
import Blog from './components/Blog';
import Post from './components/Post';

function App() {
  let [element, updatePage] = useState({id: 0, title: ""});
  let updater = (newElement: {id: number, title: string}) => updatePage(newElement);

  return (
    <div>
      <Header onScreenChange={updater}/>
      <br/>
      <br/>

      {getSelectedWindow(element, updater)}
    </div>
  );
}

function getSelectedWindow(element: {id: number, title: string}, updater: (element: {id: number, title: string}) => void) {
  let windows = [
    <Home onScreenChange={updater}/>,
    <Blog onScreenChange={updater}/>,
    <Post title={element.title} />
  ]

  return windows[element.id]
}

export default App;