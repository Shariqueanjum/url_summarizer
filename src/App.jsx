import Title from "./components/Title";
import Body from "./components/Body";

import "./App.css";

const App = () => {
  return (
    <main>
      <div className='main'>
        <div className='gradient' />
      </div>

      <div className='app'>
        <Title />
        <Body />
      </div>
    </main>
  );
};

export default App;