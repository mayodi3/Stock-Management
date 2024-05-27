import { useEffect, useState } from "react";
import WatchList from "./components/WatchList";
import { BrowserRouter, Route, NavLink, Routes } from "react-router-dom";
import StockList from "./components/StockList";

const App = () => {
  const [stocks, setStocks] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  const addToWatchList = async (stock) => {
    try {
      const response = fetch("http://localhost:5000/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stock),
      });
      (await response).json();
      setWatchlist([...watchlist, stock]);
    } catch (error) {
      console.error("Error adding to watchlist");
    }
  };

  useEffect(() => {
    async function getStocks() {
      try {
        const response = await fetch("http://localhost:5000/api/stocks");
        const data = await response.json();
        setStocks(data);
      } catch (error) {
        console.error(`Error fetching stocks:`, error);
      }
    }
    getStocks();
  }, []);

  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/stocks">Stocks</NavLink>
        <NavLink to="/watchlist">Watchlist</NavLink>
      </nav>
      <Routes>
        <Route
          path="/stocks"
          element={
            <StockList stocks={stocks} addToWatchlist={addToWatchList} />
          }
        />
        <Route
          path="/watchlist"
          element={<WatchList watchlist={watchlist} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
