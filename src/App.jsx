import { useEffect, useState } from "react";

function App() {
  const [value, setValue] = useState("");
  const [rate, setRate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [select1, setSelect1] = useState("EUR");
  const [select2, setSelect2] = useState("USD");

  useEffect(() => {
    const calculateRate = async function () {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${value}&from=${select1}&to=${select2}`
        );

        if (!value) throw new Error("Input filled cannot be empty!");

        if (select1 === select2) {
          throw new Error(`You cannot select same currencies!`);
        }

        const data = await res.json();
        setRate(Object.values(data?.rates)[0]);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    window.addEventListener("submit", calculateRate);
    return () => window.removeEventListener("submit", calculateRate);
  }, [value, select1, select2]);

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          name="amount"
          value={value}
          onChange={(e) => setValue(+e.target.value)}
        />
        <select value={select1} onChange={(e) => setSelect1(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
          <option value="CHF">CHF</option>
        </select>
        <select value={select2} onChange={(e) => setSelect2(e.target.value)}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
          <option value="CHF">CHF</option>
        </select>
        <button type="submit">convert</button>
        {isLoading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {!isLoading && !error && <p>{rate}</p>}
      </form>
    </div>
  );
}

function Loader() {
  return <p>Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}

export default App;
