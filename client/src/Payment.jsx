import Cookies from "js-cookie";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

function Payment() {
  const location = useLocation();
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [username, setUsername] = useState(Cookies.get("username") || ""); // Initialize from cookies
  const [cardType, setCardType] = useState(""); // Store card type
  const [paymentMethod, setPaymentMethod] = useState("card"); // Store payment method (card or wallet)
  const [walletBalance, setWalletBalance] = useState(100); // Simulate wallet balance (e.g., $100)

  // Verify if the username is available on component load
  useEffect(() => {
    if (!username) {
      setPaymentStatus("User not logged in. Please log in to proceed.");
    }
  }, [username]);

  // Detect card type based on the card number
  const detectCardType = (number) => {
    const visaRegex = /^4/;
    const mastercardRegex = /^5[1-5]/;
    const discoverRegex = /^6(?:011|5)/;

    if (visaRegex.test(number)) return "Visa";
    if (mastercardRegex.test(number)) return "MasterCard";
    if (discoverRegex.test(number)) return "Discover";
    return "";
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    setCardNumber(value);
    setCardType(detectCardType(value));
  };

  // Handle form submission for both card and wallet payments
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      setPaymentStatus("User not logged in. Please log in to proceed.");
      return;
    }

    if (paymentMethod === "card") {
      // Card payment logic
      try {
        const response = await axios.post("http://localhost:3001/payment", {
          username,
          cardNumber,
          expiryDate,
          cvv,
        });

        if (response.data.success) {
          setPaymentStatus("Payment successful!");
        } else {
          setPaymentStatus("Payment failed. Please try again.");
        }
      } catch (error) {
        setPaymentStatus("An error occurred during the payment process.");
        console.error(error);
      }
    } else if (paymentMethod === "wallet") {
      // Wallet payment logic
      if (walletBalance >= 50) { // Example: Check if wallet has enough funds
        try {
          const response = await axios.post("http://localhost:3001/wallet-payment", {
            username,
            amount: 50, // Example: Payment amount
          });

          if (response.data.success) {
            setWalletBalance(walletBalance - 50); // Deduct the payment from wallet balance
            setPaymentStatus("Payment successful using wallet!");
          } else {
            setPaymentStatus("Payment failed. Please try again.");
          }
        } catch (error) {
          setPaymentStatus("An error occurred during the wallet payment process.");
          console.error(error);
        }
      } else {
        setPaymentStatus("Insufficient wallet balance.");
      }
    }
  };

  return (
    <PaymentContainer>
      <h1>Payment Simulation</h1>
      <form onSubmit={handleSubmit} className="payment-form">
        <InputGroup>
          <label>Payment Method</label>
          <PaymentOption>
            <label>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Credit Card
            </label>
            <label>
              <input
                type="radio"
                value="wallet"
                checked={paymentMethod === "wallet"}
                onChange={() => setPaymentMethod("wallet")}
              />
              Wallet
            </label>
          </PaymentOption>
        </InputGroup>

        {paymentMethod === "card" && (
          <>
            <InputGroup>
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="20"
                className="input-field"
              />
              {cardType && <CardType>{cardType}</CardType>}
            </InputGroup>

            <InputGroup>
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                maxLength="5"
                className="input-field"
              />
            </InputGroup>

            <InputGroup>
              <label htmlFor="cvv">CVV</label>
              <input
                type="password"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength="3"
                className="input-field"
              />
            </InputGroup>
          </>
        )}

        {paymentMethod === "wallet" && (
          <InputGroup>
            <label>Wallet Balance: ${walletBalance}</label>
            <p>Payment amount: $50</p>
          </InputGroup>
        )}

        <SubmitButton type="submit">Pay Now</SubmitButton>
      </form>

      {paymentStatus && <PaymentStatus>{paymentStatus}</PaymentStatus>}
    </PaymentContainer>
  );
}

// Styled Components
const PaymentContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const CardType = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #333;
  font-weight: bold;
`;

const PaymentOption = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

const PaymentStatus = styled.p`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-top: 20px;
`;

export default Payment;