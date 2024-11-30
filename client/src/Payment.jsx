import Cookies from "js-cookie";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

function Payment() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [username, setUsername] = useState(Cookies.get("username") || ""); // Initialize from cookies
  const [cardType, setCardType] = useState(""); // Store card type
  const [paymentMethod, setPaymentMethod] = useState("card"); // Store payment method (card or wallet)
  const [walletBalance, setWalletBalance] = useState(100); // Simulate wallet balance (e.g., $100)
  const [isPremium, setIsPremium] = useState(false); // Check if user already has premium

  // Check if the user is already on a premium plan
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3001/subscription", {
          params: { username },
        });

        if (response.data.success) {
          setIsPremium(response.data.subscriptionType === "premium");
        } else {
          console.error("Failed to fetch subscription type:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching subscription type:", error);
      }
    };

    if (username) {
      fetchSubscriptionStatus();
    } else {
      setPaymentStatus("User not logged in. Please log in to proceed.");
    }
  }, [username]);

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

  const updateSubscription = async () => {
    try {
      const response = await axios.post("http://localhost:3001/update-subscription", {
        username,
        subscriptionType: "premium",
      });

      if (response.data.success) {
        setPaymentStatus("Your subscription has been upgraded to premium!");
        console.log("Subscription updated to premium.");
        setIsPremium(true); // Update premium status
      } else {
        setPaymentStatus("Payment successful, but subscription update failed.");
        console.error("Failed to update subscription:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      setPaymentStatus("An error occurred while updating your subscription.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      setPaymentStatus("User not logged in. Please log in to proceed.");
      return;
    }

    if (isPremium) {
      setPaymentStatus("You already have a premium subscription.");
      return;
    }

    if (paymentMethod === "wallet") {
      if (walletBalance >= 50) {
        try {
          const response = await axios.post("http://localhost:3001/wallet-payment", {
            username,
            amount: 50,
          });

          if (response.data.success) {
            setWalletBalance(walletBalance - 50); // Deduct from wallet balance
            setPaymentStatus("Payment successful using wallet!");

            // Update subscription to premium after successful wallet payment
            await updateSubscription();
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
    } else if (paymentMethod === "card") {
      try {
        const response = await axios.post("http://localhost:3001/payment", {
          username,
          cardNumber,
          expiryDate,
          cvv,
        });

        if (response.data.success) {
          setPaymentStatus("Payment successful!");
          await updateSubscription(); // Update subscription after card payment
        } else {
          setPaymentStatus("Payment failed. Please try again.");
        }
      } catch (error) {
        setPaymentStatus("An error occurred during the payment process.");
        console.error(error);
      }
    }
  };

  return (
    <PaymentContainer>
      <h1>Payment Simulation</h1>
      {isPremium && (
        <PremiumMessage>
          You are already a premium subscriber! Thank you for your support.
        </PremiumMessage>
      )}
      <form onSubmit={handleSubmit}>
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
              <label>Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="20"
              />
              {cardType && <CardType>{cardType}</CardType>}
            </InputGroup>
            <InputGroup>
              <label>Expiry Date</label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                maxLength="5"
              />
            </InputGroup>
            <InputGroup>
              <label>CVV</label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                maxLength="3"
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

        <SubmitButton type="submit" disabled={isPremium}>
          {isPremium ? "Already Subscribed" : "Pay Now"}
        </SubmitButton>
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
  margin-bottom: 15px;
`;

const CardType = styled.div`
  margin-top: 10px;
  color: #333;
  font-weight: bold;
`;

const PaymentOption = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PremiumMessage = styled.p`
  color: green;
  font-weight: bold;
  margin-bottom: 20px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const PaymentStatus = styled.p`
  margin-top: 15px;
  font-weight: bold;
  color: #333;
`;

export default Payment;