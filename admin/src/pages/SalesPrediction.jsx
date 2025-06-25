import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";
import "../css/SalesPrediction.css";

const SalesPrediction = () => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchAndPredict = async () => {
      try {
        const res = await axios.get("http://localhost:4000/sales/sales-history");
        const history = res.data;
  
        const grouped = groupByProduct(history);
        const result = [];
  
        for (const [product, records] of Object.entries(grouped)) {
          const { predictedQuantity, growthTrend, status } = await predictSales(records);
          const quantitySold = records[records.length - 1].quantitySold;
  
          result.push({
            product,
            quantitySold,
            predictedQuantity: Math.round(predictedQuantity),
            growthTrend: growthTrend.toFixed(2),
            status,
          });
        }
        console.log("Predicted results:", result);
        setPredictions(result);
      } catch (err) {
        console.error("Prediction error:", err);
      }
    };
  
    fetchAndPredict();
  }, []);  

  const groupByProduct = (data) => {
    const result = {};
    for (const item of data) {
      if (!result[item.product]) result[item.product] = [];
      result[item.product].push(item);
    }
    return result;
  };

  const predictSales = async (data) => {
    const xs = data.map((_, i) => i); // time steps
    const ys = data.map((d) => d.quantitySold);

    const xsTensor = tf.tensor1d(xs);
    const ysTensor = tf.tensor1d(ys);

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

    await model.fit(xsTensor, ysTensor, { epochs: 200 });

    const nextMonth = xs.length;
    const predicted = model.predict(tf.tensor2d([nextMonth], [1, 1]));
    const predictedValue = predicted.dataSync()[0];

    const lastActual = ys[ys.length - 1];
    const growth = ((predictedValue - lastActual) / lastActual) * 100;
    const status = growth > 5 ? "Increasing" : growth < -5 ? "Decreasing" : "Stable";

    return { predictedQuantity: predictedValue, growthTrend: growth, status };
  };

  return (
    <div className="sales-prediction-container">
      <h3 id="page-name">Sales <span>&gt;</span> Sales Prediction</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Product</th>
            <th>Quantity Sold</th>
            <th>Predicted Quantity</th>
            <th>Growth Trend (%)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((data, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{data.product}</td>
              <td>{data.quantitySold}</td>
              <td>{data.predictedQuantity}</td>
              <td>
                {data.growthTrend > 0 ? `+${data.growthTrend}` : data.growthTrend}%
              </td>
              <td className={
                data.status === "Increasing" ? "increasing" :
                data.status === "Decreasing" ? "decreasing" :
                "stable"
              }>
                {data.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesPrediction;
