//importing necessary modules

import axios from "axios";
import Cookies from "js-cookie";
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
        const response = await axios.get("http://localhost:3004/subscription", {
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

  //update subscription status
  const updateSubscription = async () => {
    try {
      const response = await axios.post("http://localhost:3004/update-subscription", {
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

  // payment only works if user is logged in
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
          const response = await axios.post("http://localhost:3004/wallet-payment", {
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
    } else if (paymentMethod === "card") { // check card details in database
      try {
        const response = await axios.post("http://localhost:3004/payment", {
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
    <PageContainer>
      <Title>Payment Page</Title>
      <PaymentContainer>
        {/* Left Section - Payment Summary */}
        <PaymentDetailsSection>
          <SectionTitle>Payment Summary</SectionTitle>
          <PaymentDetail>
            <Label>Amount:</Label>
            <Value>£50.00</Value>
          </PaymentDetail>
          <PaymentDetail>
            <Label>Tax:</Label>
            <Value>£5.00</Value>
          </PaymentDetail>
          <PaymentDetail>
            <Label>Total:</Label>
            <TotalValue>£55.00</TotalValue>
          </PaymentDetail>
        </PaymentDetailsSection>

        {/* Right Section - Payment Form */}
        <CardDetailsSection>
          {isPremium && (
            <PremiumMessage>
              You are already a premium subscriber! Thank you for your support.
            </PremiumMessage>
          )}
          <form onSubmit={handleSubmit}>
            <InputWrapper>
              <Label>Payment Method</Label>
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
            </InputWrapper>

            {paymentMethod === "card" && (
              <>
                <InputWrapper>
                  <Label>Card Number</Label>
                  <Input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="20"
                  />
                  {cardType && <CardType>{cardType}</CardType>}
                </InputWrapper>
                <InputWrapper>
                  <TwoColumn>
                    <div>
                      <Label>Expiry Date</Label>
                      <Input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        maxLength="3"
                      />
                    </div>
                  </TwoColumn>
                </InputWrapper>
              </>
            )}

            {paymentMethod === "wallet" && (
              <InputWrapper>
                <Label>Wallet Balance</Label>
                <Value>${walletBalance}</Value>
                <p>Payment amount: $50</p>
              </InputWrapper>
            )}

            <SubmitButton type="submit" disabled={isPremium}>
              {isPremium ? "Already Subscribed" : "Pay Now"}
            </SubmitButton>
          </form>
        </CardDetailsSection>
      </PaymentContainer>

      {paymentStatus && <StatusMessage>{paymentStatus}</StatusMessage>}
    </PageContainer>
  );
}

// Styled Components
const PageContainer = styled.div`
  font-family: "Poppins", sans-serif;
  background: linear-gradient(to right, #f9d976, #f39f86);
  min-height: 100vh;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0033cc;
  margin-bottom: 20px;
`;

const PaymentContainer = styled.div`
  display: flex;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-width: 900px;
  width: 100%;
`;

const PaymentDetailsSection = styled.div`
  flex: 1;
  padding: 30px;
  background-color: #f8f8f8;
  border-right: 2px solid #e5e5e5;
`;

const CardDetailsSection = styled.div`
  flex: 1;
  padding: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
`;

const PaymentDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 1rem;
  color: #555;
`;

const Value = styled.span`
  font-weight: 500;
  font-size: 1rem;
  color: #333;
`;

const TotalValue = styled(Value)`
  font-size: 1.2rem;
  font-weight: bold;
  color: #0033cc;
`;

const PaymentOption = styled.div`
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  label {
    font-size: 1rem;
    font-weight: 500;
    color: #555;
  }
`;

const CardType = styled.div`
  margin-top: 10px;
  font-weight: bold;
  color: #0033cc;
`;

const InputWrapper = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  color: #333;
  outline: none;
  &:focus {
    border-color: #0033cc;
  }
`;

const TwoColumn = styled.div`
  display: flex;
  gap: 15px;
`;

const SubmitButton = styled.button`
  width: 100%;
  background-color: #0033cc;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #002499;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const PremiumMessage = styled.p`
  color: green;
  font-weight: bold;
  margin-bottom: 20px;
`;

const StatusMessage = styled.p`
  margin-top: 20px;
  font-weight: 600;
  font-size: 1rem;
  color: #0033cc;
`;

export default Payment;