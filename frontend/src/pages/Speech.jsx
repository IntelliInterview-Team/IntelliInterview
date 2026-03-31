import React from "react";
import { useParams } from "react-router-dom";

const Speech = () => {
  const { sessionId } = useParams();

  return (
    <div>
      <h2>Speech Module</h2>
      <p>Session ID: {sessionId}</p>
    </div>
  );
};

export default Speech; // ✅ THIS IS IMPORTANT