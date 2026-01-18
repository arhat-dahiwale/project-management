import { useState } from "react";
import Counter from "./Counter.jsx";
import Reset from "./Reset.jsx";
import DisplayEven from "./DisplayEven.jsx";
import TaskItem from "./TaskItem.jsx";

function App() {
  const [count, setCount] = useState(0);
  const tasks = [
    "Learn React",
    "Modify React",
    "Great!"
  ]

  function increment() {
    setCount(c => c+1);
  }

  function resetCount() {
    setCount(c => 0);
  }

  return (
    <div>
      <Counter value={count} onIncrement={increment}></Counter>
      <Reset show={count>10} resetCount={resetCount} />
      <DisplayEven condition={count %2 == 0} />


      <div>
        <h1>Tasks</h1>
        <ul>
          {tasks.map(task => (
            <TaskItem key={task} task={task} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;