import React from "react";

const colors = {
  Active:    { bg: "rgba(39,201,63,.15)",  border: "rgba(39,201,63,.35)",  text: "#27c93f" },
  Confirmed: { bg: "rgba(0,207,255,.12)",  border: "rgba(0,207,255,.3)",   text: "#00cfff" },
  Pending:   { bg: "rgba(255,200,64,.12)", border: "rgba(255,200,64,.3)",  text: "#ffc840" },
  Completed: { bg: "rgba(106,140,176,.12)",border: "rgba(106,140,176,.3)", text: "#6a8cb0" },
  Cancelled: { bg: "rgba(255,60,60,.12)",  border: "rgba(255,60,60,.3)",   text: "#ff6b6b" },
};

export default function StatusBadge({ status }) {
  const c = colors[status] || colors.Pending;
  return (
    <span style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
      padding: ".2rem .7rem",
      borderRadius: 20,
      fontSize: ".72rem",
      fontWeight: 700,
      letterSpacing: ".06em",
      whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}
