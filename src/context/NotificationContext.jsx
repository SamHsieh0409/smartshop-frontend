import { createContext, useContext, useState } from "react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const show = (message, type = "success") => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2);
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 2500);
  };

  return (
    <NotificationContext.Provider value={{ show }}>
      {children}

      <div style={styles.container}>
        {notifications.map((n) => (
          <div key={n.id} style={styles[n.type]}>
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotify = () => useContext(NotificationContext);

const styles = {
  container: {
    position: "fixed",
    top: "80px",
    right: "20px",
    zIndex: 9999,
  },
  success: {
    marginBottom: "10px",
    padding: "12px 16px",
    background: "#4caf50",
    color: "white",
    borderRadius: "8px",
    fontWeight: "bold",
  },
  error: {
    marginBottom: "10px",
    padding: "12px 16px",
    background: "#f44336",
    color: "white",
    borderRadius: "8px",
    fontWeight: "bold",
  },
  warning: {
    marginBottom: "10px",
    padding: "12px 16px",
    background: "#ff9800",
    color: "white",
    borderRadius: "8px",
    fontWeight: "bold",
  }
};
