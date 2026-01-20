import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'white',
      color: 'black',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '120px', marginBottom: '20px', color: '#dc3545' }}>
        404
      </div>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: '#666', maxWidth: '500px' }}>
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        >
          Go Home
        </Link>
        <Link
          href="/documents"
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        >
          Document Conversion
        </Link>
        <Link
          href="/images"
          style={{
            padding: '12px 24px',
            backgroundColor: '#17a2b8',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        >
          Image Conversion
        </Link>
      </div>
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px', maxWidth: '600px' }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Popular Tools</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          <Link href="/merge-pdf" style={{ color: '#007bff', textDecoration: 'none' }}>Merge PDF</Link>
          <Link href="/convert-pdf-to-word" style={{ color: '#007bff', textDecoration: 'none' }}>PDF to Word</Link>
          <Link href="/convert-word-to-pdf" style={{ color: '#007bff', textDecoration: 'none' }}>Word to PDF</Link>
          <Link href="/url-to-markdown" style={{ color: '#007bff', textDecoration: 'none' }}>URL to Markdown</Link>
        </div>
      </div>
    </div>
  )
}