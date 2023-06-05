import React, { useState } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import ReactMapboxAutocomplete from 'react-mapbox-autocomplete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import rocketLogo from './images/rocket-logo.png';

function App() {


  const [isLoading, setIsLoading] = useState(false);
  const [quoteDate, setQuoteDate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [serverResponses, setServerResponses] = useState([]);
  const [showResponses, setShowResponses] = useState(false); // New state variable

  const submitRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowResponses(false); // Hide the mt-4 element

    const birthDayRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!birthDayRegex.test(birthDay)) {
      toast.error('Invalid birthDay format');
      setIsLoading(false);
      return;
    }

    const requestBody = {
      firstName: firstName,
      lastName: lastName,
      emailAddress: emailAddress,
      birthDay: birthDay,
      zipCode: zipCode
    };

    try {
      const response = await axios.post('http://45.79.149.34:3000/api/scrape', requestBody);
      const { firstName, lastName, quoteCount } = response.data;

      console.log('First Name:', firstName);
      console.log('Last Name:', lastName);
      console.log('Quote Count:', quoteCount);
      setQuoteDate(quoteCount);

   // Update serverResponses state with the new response
   setServerResponses([response.data]); // Replace previous responses with current response
   setShowResponses(true); // Set showResponses to true
 } catch (error) {
   console.error('API Error:', error);
   setQuoteDate('');
   // Update serverResponses state with the error response
   setServerResponses([{ error: error.message }]); // Replace previous responses with error response
   setShowResponses(true); // Set showResponses to true
 }
    setIsLoading(false);
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmailAddress('');
    setBirthDay('');
    setZipCode('');
    setServerResponses([]);
    setShowResponses(false); // Hide the mt-4 element
    window.location.reload();
  };

  
  

  const handleAddressSelect = (address) => {
    const parts = address.split(',');
    const extractedZipCode = parts[parts.length - 2].trim();
    const filteredZipCode = extractedZipCode.replace(/\D/g, '');
    setZipCode(filteredZipCode);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="logo-container">
            <img src={rocketLogo} alt="Retention Rocket" />
          </div>
          <form onSubmit={submitRequest}>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Email Address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Birthday: MM/DD/YYYY"
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <ReactMapboxAutocomplete
                publicKey="pk.eyJ1IjoiYmxlbnR6IiwiYSI6ImNsaWRnaWVseTBzMzczZm1tM2xiNXhueHYifQ.J7YBQwEc9rEuycuW_8Nb8w"
                inputClass="form-control"
                onSuggestionSelect={(address) => handleAddressSelect(address)}
                country="us"
                resetSearch={false}
                placeholder="Enter Mailing Address"
              />
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="mr-2" />
                    Loading...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Reset
              </button>
            </div>
          </form>
          {showResponses && (
            <div className="mt-4">
              {serverResponses.length > 0 ? (
                serverResponses.map((response, index) => (
                  <p key={index} className="text-center">
                    {response.error ? (
                      <span>Error: {response.error}</span>
                    ) : (
                      <>
                        Quotes in the last 30 days: {response.quoteDate}
                      </>
                    )}
                  </p>
                ))
              ) : (
                <p className="text-center">No Responses</p>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
      <div className="disclaimer mt-4">
        <h3>Tips and Tricks:</h3>
        <ul>
          <li>Retention Rocket is in Beta and is free while more features are being added.</li>
          <li>After clicking submit,it may take up to a full minute to get a response.</li>
          <li>Please enter the birth date in the format MM/DD/YYYY</li>
          <li>The car insurance quotes returned are from the last 30-45 days.</li>
          <li>Retention Rocket cannot detect if your client has shopped with smaller regional carriers.</li>
          <li>We suggest you shop for car insurance quotes yourself and then input your information for testing.</li>
        </ul>
      </div>
    </div>
  );
  
}

export default App;
