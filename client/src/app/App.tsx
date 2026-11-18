export default function App() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '0.5rem',
          }}
        >
          Qwizo
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem' }}>
          Interactive Quiz Platform
        </p>
      </div>
    </main>
  )
}
