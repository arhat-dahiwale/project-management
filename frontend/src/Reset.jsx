function Reset({show, resetCount}) {
    if (!show) {
        return null;
    }
    return <button onClick={resetCount}>Reset</button>
}

export default Reset;