import { BrowserRouter as Router, Link } from 'react-router-dom'
import { Menu } from 'antd'
import './App.css'
import { useState } from 'react'
const menus = [
  {
    key: '/',
    title: '主页',
    path: '/',
    label: <Link to="/">React主应用</Link>,
  },
  {
    key: '/app-vue',
    route: '/app-vue',
    title: 'vue微应用',
    label: <Link to="/app-vue">vue微应用</Link>,
  },
]

function App() {
  const [selectedKey, setSelectKey] = useState(window.location.pathname)

  let style = {
    width: '100vw',
    height: '100vh',
  }

  return (
    <Router>
      {/* <h1>主应用启动成功</h1> */}
      <div className="App">
        <Menu
          selectedKeys={[selectedKey]}
          style={{
            width: 256,
          }}
          theme="dark"
          mode="inline"
          items={menus}
          onSelect={e=>setSelectKey(e.key)}
        ></Menu>
        {selectedKey === '/' ? 
          <div style={Object.assign({
            display: 'flex', marginTop: '10vh', fontSize: '40px', justifyContent: 'center',
            }, style)}>
            React主应用
          </div> :
          <div id="micro-container" style={style}></div>
        }
      </div>
    </Router>
  )
}

export default App
