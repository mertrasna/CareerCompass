import Cookies from "js-cookie";

class NotificationManager {
  constructor() {
    this.observers = []; // List of registered observers
  }

  // Add a new observer
  addObserver(observer) {
    console.log("Observer added:", observer); // Debug log
    this.observers.push(observer);
  }

  // Remove an observer
  removeObserver(observer) {
    
    console.log("Observer removed:", observer); // Debug log
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  // Add a new notification
  addNotification(notification) {
    const updatedNotifications = this.getNotifications();
    const exists = updatedNotifications.some(
      (n) => n.message === notification.message && n.type === notification.type
    );

    if (!exists) {
      updatedNotifications.push(notification);
      Cookies.set("notifications", JSON.stringify(updatedNotifications), { expires: 7 });
      console.log("Notification added to cookies and system:", notification.message);

      // Send notification to the server for persistence/logging
      fetch("http://localhost:3007/log-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notification }),
      }).catch((error) => console.error("Error logging notification to server:", error));

      this.notifyObservers(notification);
    } else {
      console.log("Duplicate notification ignored:", notification);
    }
  }

  // Notify all observers about a change
  notifyObservers(notification) {
    console.log("Notifying observers:", notification); // Debug log
    this.observers.forEach((observer) => observer(notification));
  }

  // Retrieve notifications from cookies
  getNotifications() {
    try {
      const savedNotifications = Cookies.get("notifications");
      const notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
      
      // Log current notifications to the terminal
      console.log("Current notifications loaded from cookies:", notifications);

      return notifications;
    } catch (error) {
      console.error("Error retrieving notifications from cookies:", error);
      return [];
    }
  }

  // Clear all notifications
  clearNotifications() {
    console.log("Clearing all notifications"); // Debug log
    Cookies.remove("notifications");
    this.observers.forEach((observer) => observer([])); // Notify all observers with an empty array
    
    // Log cleared notifications to the terminal
    console.log("All notifications have been cleared from cookies and system.");
  }
}

// Singleton instance
const notificationManager = new NotificationManager();
export default notificationManager;