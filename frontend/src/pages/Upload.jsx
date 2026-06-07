import { useState } from 'react'
import { uploadReceipt } from '../api/receipts'
import { useNavigate } from 'react-router-dom'

function Upload() {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
        setResult(null)
        setError(null)
    }

    const handleUpload = async () => {
        if (!file) return
        setLoading(true)
        setError(null)
        try {
            const data = await uploadReceipt(file)
            setResult(data)
        } catch (err) {
            setError('Upload failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: '560px', margin: '24px auto', padding: '0 16px' }}>
            <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '24px',
                boxShadow: 'var(--shadow)',
            }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px', color: 'var(--text)' }}>
                    Upload Receipt
                </h2>
                <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' }}>
                    AI will extract merchant, amount, date and category automatically
                </p>

                {/* Drop zone */}
                <div style={{
                    border: '2px dashed var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '40px 20px',
                    textAlign: 'center',
                    background: 'var(--bg2)',
                    marginBottom: '16px',
                }}>
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>📤</div>
                    <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px', fontSize: '14px' }}>
                        {file ? file.name : 'Select your receipt'}
                    </p>
                    <p style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '16px' }}>
                        JPG, PNG, PDF — up to 10MB
                    </p>
                    <label style={{
                        background: 'var(--accent)',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 22px',
                        borderRadius: '20px',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'inline-block',
                    }}>
                        Browse File
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </label>
                </div>

                {/* Upload button */}
                {file && (
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        style={{
                            width: '100%',
                            background: loading ? 'var(--muted)' : 'var(--accent)',
                            color: '#fff',
                            border: 'none',
                            padding: '11px',
                            borderRadius: 'var(--radius)',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: '16px',
                        }}
                    >
                        {loading ? '⏳ Processing...' : '🚀 Upload & Extract'}
                    </button>
                )}

                {/* Error */}
                {error && (
                    <div style={{
                        background: '#fef2f2',
                        border: '1px solid var(--danger)',
                        borderRadius: 'var(--radius)',
                        padding: '12px',
                        color: 'var(--danger)',
                        fontSize: '13px',
                        marginBottom: '16px',
                    }}>{error}</div>
                )}

                {/* Result */}
                {result && (
                    <div style={{
                        background: 'var(--bg2)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '16px',
                    }}>
                        <p style={{ fontWeight: 600, color: 'var(--success)', marginBottom: '12px', fontSize: '14px' }}>
                            ✅ Receipt processed successfully!
                        </p>
                        {[
                            { label: 'Merchant', value: result.extracted?.merchant },
                            { label: 'Amount', value: `₹${result.extracted?.amount}` },
                            { label: 'Date', value: result.extracted?.date },
                            { label: 'Category', value: result.extracted?.category },
                        ].map(({ label, value }) => (
                            <div key={label} style={{
                                display: 'flex', justifyContent: 'space-between',
                                padding: '8px 0',
                                borderBottom: '1px solid var(--border)',
                                fontSize: '13px',
                            }}>
                                <span style={{ color: 'var(--muted)' }}>{label}</span>
                                <span style={{ fontWeight: 500, color: 'var(--text)' }}>{value}</span>
                            </div>
                        ))}
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                marginTop: '16px',
                                width: '100%',
                                background: 'var(--accent)',
                                color: '#fff',
                                border: 'none',
                                padding: '10px',
                                borderRadius: 'var(--radius)',
                                fontWeight: 600,
                                fontSize: '13px',
                                cursor: 'pointer',
                            }}
                        >View in Dashboard →</button>
                    </div>
                )}

                {/* Info pills */}
                {!result && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['🤖 AI powered', '🔒 Secure upload', '⚡ Instant results'].map(tag => (
                            <span key={tag} style={{
                                background: 'var(--accent-light)',
                                color: 'var(--accent)',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 500,
                            }}>{tag}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Upload