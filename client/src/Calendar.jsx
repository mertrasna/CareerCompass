import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
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
        const response = await axios.get("http://localhost:3007/interview-schedule", {
          params: { username },
        });

        if (response.data.success) {
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
    <div style={styles.page}>
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
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #FFA500, #0056b3)", // Fading orange-to-blue gradient
    fontFamily: "'Poppins', sans-serif", // Modern font
  },
  container: {
    width: "800px",
    backgroundColor: "white", // White calendar container
    color: "#333",
    borderRadius: "10px",
    padding: "30px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
    textAlign: "center",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "20px",
    color: "#0056b3", // Deep blue title
  },
  error: {
    fontSize: "1.2rem",
    color: "#e63946", // Red for errors
  },
};

export default Calendar;