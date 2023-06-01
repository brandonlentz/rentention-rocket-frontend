import React, { useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import GooglePlacesAutocomplete from 'react-google-autocomplete';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [quoteDate, setQuoteDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [zipCode, setZipCode] = useState('');

  const submitRequest = async () => {
    setIsLoading(true);

    const formattedBirthDay = new Date(birthDay).toLocaleDateString('en-US');

    const requestBody = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      birthDay: formattedBirthDay,
      zipCode: zipCode
    };

    try {
      const response = await axios.post('http://localhost:3000/api/scrape', requestBody);
      const { quoteDate } = response.data;
      console.log('Quote Date:', quoteDate);
      setQuoteDate(quoteDate || 'No Recent Quotes');
    } catch (error) {
      console.error('API Error:', error);
      // Handle the error
      setQuoteDate('');
    }

    setIsLoading(false);
  };

  return (
    <div>
      <h1>Retention Booster</h1>
      <h2>Please enter the customer details below:</h2>
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="text"
        name="emailAddress"
        placeholder="Email Address"
        onChange={(e) => setEmailAddress(e.target.value)}
      />
      <input
        type="date"
        name="birthDay"
        onChange={(e) => setBirthDay(e.target.value)}
      />
      <GooglePlacesAutocomplete
        apiKey="AIzaSyD54kLmgAJK3ZRfTCIrL-ya_ZgtAz_dul0"
        autocompletionRequest={{
          types: ['geocode']
        }}
        
        placeholder="Enter Mailing Address"
        onSelect={(data) => setZipCode(data.postcode || '')}
      />
      <button onClick={submitRequest}>Submit</button>

      {isLoading ? (
        <div className="loading-spinner">
          <FaSpinner className="spin" />
        </div>
      ) : (
        <div>
          {quoteDate && <p>Quote Date: {quoteDate}</p>}
          {!quoteDate && <p>No Recent Quotes</p>}
        </div>
      )}
    </div>
  );
}

export default App;
