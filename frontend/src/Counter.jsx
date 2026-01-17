function Counter({value, onIncrement}) {
    return(
        <div>
            <h1>{value}</h1>
            <button onClick={onIncrement}>+</button>
        </div>
    );
}

export default Counter;