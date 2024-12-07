// observer pattern for notifications
import Cookies from "js-cookie";

class NotificationManager {
  constructor() {
    this.observers = []; // the list of registered obsv
  }

  // adding an observer
  addObserver(observer) {
    console.log("Observer added:", observer); // debug log
    this.observers.push(observer);
  }

  // removing an observer
  removeObserver(observer) {
    
    console.log("Observer removed:", observer); // debug log
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  // add notification
  addNotification(notification) {
    const updatedNotifications = this.getNotifications();
    const exists = updatedNotifications.some(
      (n) => n.message === notification.message && n.type === notification.type
    );

    if (!exists) { // check if the notification already exists
      updatedNotifications.push(notification);
      Cookies.set("notifications", JSON.stringify(updatedNotifications), { expires: 7 });
      console.log("Notification added to cookies and system:", notification.message);

      // send notification to the server
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

  // notifiying observers
  notifyObservers(notification) {
    console.log("Notifying observers:", notification); // Debug log
    this.observers.forEach((observer) => observer(notification));
  }

  // #get notifications from cookies
  getNotifications() {
    try {
      const savedNotifications = Cookies.get("notifications");
      const notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
      
      // for the console
      console.log("Current notifications loaded from cookies:", notifications);

      return notifications;
    } catch (error) {
      console.error("Error retrieving notifications from cookies:", error);
      return [];
    }
  }

  // clear notifications
  clearNotifications() {
    console.log("Clearing all notifications"); // Debug log
    Cookies.remove("notifications");
    this.observers.forEach((observer) => observer([])); // Notify all observers with an empty array
    
    // Log cleared notifications to the terminal
    console.log("All notifications have been cleared from cookies and system.");
  }
}


const notificationManager = new NotificationManager();
export default notificationManager;