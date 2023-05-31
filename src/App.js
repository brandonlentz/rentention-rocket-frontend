import "./App.css";
import { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC--6Fm8xQWEOq6R2UofnDu3tfYNMoTRKc",
  authDomain: "retention-rocket.firebaseapp.com",
  projectId: "retention-rocket",
  storageBucket: "retention-rocket.appspot.com",
  messagingSenderId: "888724071778",
  appId: "1:888724071778:web:52c6f683e3c2820b79383b",
  measurementId: "G-CVDCYY7PW4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  const [parsedData, setParsedData] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [values, setValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quoteDates, setQuoteDates] = useState([]);

  useEffect(() => {
    const sendAPIRequests = async () => {
      setIsLoading(true);

      // Send API requests for each item in the parsed data with a delay
      const delay = 5000; // Delay between each request in milliseconds
      const quoteDates = [];

      for (let i = 0; i < values.length; i++) {
        const item = values[i];
        const { firstName, lastName, emailAddress, birthDay, zipCode } = item;
        const requestBody = { firstName, lastName, emailAddress, birthDay, zipCode };

        try {
          const response = await axios.post("http://localhost:3000/api/scrape", requestBody);
          const { quoteDate } = response.data;
          console.log("Quote Date:", quoteDate);
          quoteDates.push(quoteDate || "No Recent Quotes"); // Use "No Recent Quotes" if quoteDate is null
        } catch (error) {
          console.error("API Error:", error);
          // Handle the error
          quoteDates.push("");
        }

        // Delay before sending the next request
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      setIsLoading(false);
      setQuoteDates(quoteDates);
    };

    if (parsedData.length > 0) {
      sendAPIRequests();
      console.log("Parsed Data:", parsedData);
    }
  }, [parsedData, values]);

  const changeHandler = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = [];
        const valuesArray = [];

        results.data.forEach((d) => {
          rowsArray.push(Object.keys(d));
          valuesArray.push(d); // Add the whole object to valuesArray
        });

        setParsedData(results.data);
        setTableRows(rowsArray[0]);
        setValues(valuesArray);
        setQuoteDates([]);
      },
    });
  };

  return (
    <div>
      <h1>Retention Booster</h1> {/* Added title */}
      <h2>Please upload your customer list csv below:</h2> {/* Added subtitle */}
      <input
        type="file"
        name="file"
        onChange={changeHandler}
        accept=".csv"
        style={{ display: "block", margin: "10px auto" }}
      />
      <br />
      <br />
      {isLoading ? (
        <div className="loading-spinner">
          <FaSpinner className="spin" />
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              {tableRows.map((rows, index) => {
                return <th key={index}>{rows}</th>;
              })}
              <th>Quote Date</th> {/* Added new column */}
            </tr>
          </thead>
          <tbody>
            {values.map((value, index) => {
              return (
                <tr key={index}>
                  {Object.values(value).map((val, i) => {
                    return <td key={i}>{val}</td>;
                  })}
                  <td>{quoteDates[index]}</td> {/* Display quote date */}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;