import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.css'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap/dist/js/bootstrap.js'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

let element = document.getElementById('root')
if(element) element.style.height = window.innerHeight + "px";