import React, { useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import ReactMapboxAutocomplete from 'react-mapbox-autocomplete';

function App() {
  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [quoteDate, setQuoteDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Submit form request
  const submitRequest = async () => {
    setIsLoading(true);

    // Format birthDay as a localized string
    const formattedBirthDay = new Date(birthDay).toISOString();

    // Create the request body
    const requestBody = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      birthDay: formattedBirthDay,
      zipCode: zipCode
    };

    try {
      // Send a POST request to the API endpoint
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

  // Handle address selection
  const handleAddressSelect = (address) => {
    const parts = address.split(',');
    const extractedZipCode = parts[parts.length - 2].trim();
    const filteredZipCode = extractedZipCode.replace(/\D/g, ''); // Remove non-numeric characters
    setZipCode(filteredZipCode);
  };

  // JSX markup for the component's UI
  return (
    <div className="container mt-5">
      <h1 className="text-center">Retention Booster</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Email Address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Birth Day</label>
              <input
                type="date"
                className="form-control"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Mailing Address</label>
              <ReactMapboxAutocomplete
                publicKey="pk.eyJ1IjoiYmxlbnR6IiwiYSI6ImNsaWRnaWVseTBzMzczZm1tM2xiNXhueHYifQ.J7YBQwEc9rEuycuW_8Nb8w"
                inputClass="form-control"
                onSuggestionSelect={(address) => handleAddressSelect(address)}
                country="us"
                resetSearch={false}
                placeholder="Enter Mailing Address"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={submitRequest}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                  Loading...
                </>
              ) : (
                'Submit'
              )}
            </button>
          </form>
          {quoteDate && (
            <div className="mt-4">
              <p className="text-center">Quote Date: {quoteDate}</p>
            </div>
          )}
          {!quoteDate && (
            <div className="mt-4">
              <p className="text-center">No Recent Quotes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
