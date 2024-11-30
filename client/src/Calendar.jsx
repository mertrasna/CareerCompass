import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid"; // For day grid view
import interactionPlugin from "@fullcalendar/interaction"; // For user interactions
import Cookies from "js-cookie";
import axios from "axios";

function Calendar() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const username = Cookies.get("username");

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!username) {
        setError("You are not logged in. Please log in to view your calendar.");
        return;
      }

      try {
        // Fetch interviews from the backend
        const response = await axios.get("http://localhost:3001/interview-schedule", {
          params: { username },
        });

        if (response.data.success) {
          // Format the interview data into FullCalendar event objects
          const formattedEvents = response.data.interviews.map((interview) => ({
            title: `Interview for Post ID: ${interview.postId}`,
            start: new Date(interview.interviewDate).toISOString(),
          }));
          setEvents(formattedEvents);
        } else {
          setError(response.data.message || "Failed to fetch interview schedule.");
        }
      } catch (err) {
        console.error("Error fetching interview schedule:", err);
        setError("An error occurred while fetching your interview schedule.");
      }
    };

    fetchInterviews();
  }, [username]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Your Calendar</h1>
      {error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          height="auto"
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
    color: "#333",
  },
  error: {
    color: "red",
    fontSize: "1.2rem",
  },
};

export default Calendar;