export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", display: "grid", placeItems: "center", padding: "40px" }}>
      <div style={{ textAlign: "center", maxWidth: 700 }}>
        <p style={{ letterSpacing: "0.18em", fontSize: 12, opacity: 0.6 }}>LUXURY HOUSE</p>
        <h1 style={{ fontSize: "clamp(42px, 7vw, 88px)", lineHeight: 0.95, margin: "20px 0" }}>COMING SOON</h1>
        <p style={{ opacity: 0.65, lineHeight: 1.7 }}>
          The previous burger WebGL asset has been removed from the entry page. The luxury-house experience can now be connected without a missing 3D asset crashing the site.
        </p>
      </div>
    </main>
  );
}
