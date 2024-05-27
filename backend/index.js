import express from "express";
import { Schema, connect, model } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const URI = process.env.URI;

app.use(cors());
app.use(express.json());

app.use((req, _, next) => {
  console.log(req.method, req.path);
  next();
});

const StockSchema = new Schema({
  company: String,
  description: String,
  initial_price: Number,
  price_2023: Number,
  price_2024: Number,
  symbol: String,
});

const StockModel = model("Stock", StockSchema);

app.get("/api/stocks", async (req, res) => {
  try {
    const stocks = await StockModel.find({});
    res.json(stocks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/watchlist", async (req, res) => {
  try {
    const {
      company,
      description,
      initial_price,
      price_2023,
      price_2024,
      symbol,
    } = req.body;
    await StockModel.create({
      company,
      description,
      initial_price,
      price_2023,
      price_2024,
      symbol,
    });
    res.json({ message: "Stock Added to watchlist successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function connectToDBAndSever() {
  try {
    await connect(URI);
    app.listen(PORT, () => {
      console.log(`Connected to DB and running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
}

connectToDBAndSever();
