import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const COLORS = ["#2ecc71", "#e74c3c"];

export default function ResultDashboard() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/session/${sessionId}/result`)
      .then((res) => res.json())
      .then(setData);
  }, [sessionId]);

  if (!data) return <div className="text-white p-6">Loading...</div>;

  const calcStats = (section) => {
    let total = 0, correct = 0;
    Object.values(section || {}).forEach((val) => {
      total++;
      if (val.correct) correct++;
    });
    return { total, correct, wrong: total - correct };
  };

  const verbalStats = calcStats(data.verbal);
  const corecsStats = calcStats(data.corecs);
  const aptitudeStats = calcStats(data.aptitude);

  const codingStats = {
    total: Object.keys(data.coding || {}).length,
    passed: Object.values(data.coding || {}).filter(v => v.result?.passed).length
  };

  const totalQuestions = verbalStats.total + corecsStats.total + aptitudeStats.total + codingStats.total;
  const totalCorrect = verbalStats.correct + corecsStats.correct + aptitudeStats.correct + codingStats.passed;

  const percentage = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const renderPie = (label, correct, total) => {
    const value = total ? Math.round((correct / total) * 100) : 0;

    return (
      <div style={styles.pieCard}>
        <PieChart width={120} height={120}>
          <Pie
            data={[
              { name: "Score", value: value },
              { name: "Remaining", value: 100 - value }
            ]}
            dataKey="value"
            outerRadius={45}
          >
            {COLORS.map((c, i) => (
              <Cell key={i} fill={c} />
            ))}
          </Pie>
        </PieChart>
        <p>{label}</p>
        <small>{correct}/{total}</small>
      </div>
    );
  };

  const barData = [
    { name: "Verbal", score: verbalStats.correct },
    { name: "CoreCS", score: corecsStats.correct },
    { name: "Aptitude", score: aptitudeStats.correct },
    { name: "Coding", score: codingStats.passed }
  ];

  const renderSection = (title, sectionData, showSelected = false) => (
    <div style={styles.sectionCard}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {Object.entries(sectionData || {}).map(([q, val], i) => (
        <div key={i} style={styles.qCard}>
          <p><b>Q:</b> {q}</p>
          {showSelected && <p><b>Selected:</b> {val.selected}</p>}
          <p style={{ color: val.correct ? "#2ecc71" : "#e74c3c", fontWeight: "bold" }}>
            {val.correct ? "✔ Correct" : "✘ Wrong"}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2>🚀 IntelliInterview</h2>
        <button onClick={() => navigate("/")} style={styles.homeBtn}>
          ⬅ Back to Home
        </button>
      </div>

      {/* PIE ROW */}
      <div style={styles.card}>
        <h2>📊 Overall Summary</h2>
        <div style={styles.pieRow}>
          {renderPie("Aptitude", aptitudeStats.correct, aptitudeStats.total)}
          {renderPie("Verbal", verbalStats.correct, verbalStats.total)}
          {renderPie("Core CS", corecsStats.correct, corecsStats.total)}
          {renderPie("Coding", codingStats.passed, codingStats.total)}
        </div>
      </div>

      {/* BAR CHART */}
      <div style={styles.card}>
        <h2>📈 Performance Comparison</h2>
        <BarChart width={500} height={250} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" />
        </BarChart>
      </div>

      {/* SPEECH */}
      <div style={styles.card}>
        <h2>🎤 Speech Analysis</h2>
        {data.speech?.length > 0 ? (
          data.speech.map((s, i) => (
            <div key={i} style={styles.qCard}>
              <p><b>Answer:</b> {s.transcript}</p>
              <p><b>Feedback:</b> {JSON.stringify(s.feedback)}</p>
            </div>
          ))
        ) : (
          <p>No speech answers</p>
        )}
      </div>

      {/* SEPARATED SECTIONS */}
      {renderSection("📘 Aptitude", data.aptitude, true)}
      {renderSection("🗣 Verbal", data.verbal)}
      {renderSection("💻 Core CS", data.corecs)}

      {/* CODING */}
      <div style={styles.sectionCard}>
        <h2 style={styles.sectionTitle}>👨‍💻 Coding</h2>
        {Object.entries(data.coding || {}).map(([q, val], i) => (
          <div key={i} style={styles.qCard}>
            <p><b>Question:</b> {q}</p>
            <p>Passed: {val.result?.passed}</p>
            <p>Total: {val.result?.total}</p>
          </div>
        ))}
      </div>

      {/* OVERALL */}
      <div style={styles.cardCenter}>
        <h2>🏆 Overall Performance</h2>
        <h3 style={{ color: "#2ecc71" }}>Score: {percentage}%</h3>
      </div>

    </div>
  );
}

const styles = {
  container: {
    background: "linear-gradient(135deg, #2b5876, #4e4376)",
    minHeight: "100vh",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    color: "white",
  },
  homeBtn: {
    background: "white",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  card: {
    background: "white",
    marginTop: "20px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  },
  cardCenter: {
    background: "white",
    marginTop: "20px",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  },
  pieRow: {
    display: "flex",
    justifyContent: "space-around",
    flexWrap: "wrap"
  },
  pieCard: {
    textAlign: "center",
    margin: "10px"
  },
  sectionCard: {
    background: "white",
    marginTop: "20px",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
  },
  sectionTitle: {
    marginBottom: "10px",
    color: "#333"
  },
  qCard: {
    background: "#f9f9f9",
    padding: "12px",
    marginTop: "10px",
    borderRadius: "8px",
    borderLeft: "5px solid #4e73df"
  }
};