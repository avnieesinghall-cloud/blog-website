export default function Editor() {
  return (
    <div>
      <textarea
        placeholder="Write your story..."
        style={{
          width: "100%",
          minHeight: "300px",
          padding: "20px",
          borderRadius: "16px",
          background: "#0f172a",
          color: "white",
          border: "1px solid rgba(255,255,255,0.1)",
          outline: "none",
          fontSize: "16px"
        }}
      />
    </div>
  );
}