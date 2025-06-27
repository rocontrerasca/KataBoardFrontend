export const fullScreenContainer: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
};

export const formContainer: React.CSSProperties = {
    width: "100%",
    maxWidth: "400px",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

export const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.5rem",
    marginTop: "0.25rem",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
};

export const labelStyle: React.CSSProperties = {
    fontWeight: "bold",
};

export const buttonStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
};

export const errorStyle: React.CSSProperties = { color: "red", marginTop: "0.5rem" };
export const successStyle: React.CSSProperties = { color: "green", marginTop: "0.5rem" };

export const centeredButton: React.CSSProperties = {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    display: "block",
    fontSize: "1rem",
    width: "fit-content",    
  margin: "0.5rem auto 0 auto"
};