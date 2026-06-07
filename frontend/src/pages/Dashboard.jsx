import { useEffect, useState } from 'react'
import { getReceipts, updateWarranty } from '../api/receipts'
import { Link } from 'react-router-dom'

const categoryColors = {
    Food: { bg: '#fef3c7', color: '#92400e' },
    Electronics: { bg: '#dbeafe', color: '#1e40af' },
    Clothing: { bg: '#fce7f3', color: '#9d174d' },
    Medical: { bg: '#dcfce7', color: '#166534' },
    Travel: { bg: '#ede9fe', color: '#5b21b6' },
    Utilities: { bg: '#ffedd5', color: '#9a3412' },
    Other: { bg: '#f1f5f9', color: '#475569' },
}

function Dashboard() {
    const [receipts, setReceipts] = useState([])
    const [loading, setLoading] = useState(true)
    const [warrantyInputs, setWarrantyInputs] = useState({})

    useEffect(() => {
        fetchReceipts()
    }, [])

    const fetchReceipts = async () => {
        try {
            const data = await getReceipts()
            setReceipts(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleWarrantySave = async (id) => {
        const date = warrantyInputs[id]
        if (!date) return
        await updateWarranty(id, date)
        fetchReceipts()
    }

    const totalSpent = receipts.reduce((sum, r) => sum + (r.amount || 0), 0)
    const expiringSoon = receipts.filter(r => {
        if (!r.warranty_expiry || r.warranty_expiry === 'None') return false
        const days = (new Date(r.warranty_expiry) - new Date()) / (1000 * 60 * 60 * 24)
        return days <= 30 && days >= 0
    }).length

    return (
        <div style={{ maxWidth: '900px', margin: '24px auto', padding: '0 16px' }}>

            {/* Header */}
            <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '20px 24px',
                marginBottom: '12px', boxShadow: 'var(--shadow)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>
                        My Receipts
                    </h2>
                    <p style={{ color: 'var(--muted)', fontSize: '13px' }}>
                        Track your purchases and warranty expiry dates
                    </p>
                </div>
                <Link to="/upload" style={{
                    background: 'var(--accent)', color: '#fff',
                    padding: '8px 18px', borderRadius: '20px',
                    textDecoration: 'none', fontSize: '13px', fontWeight: 600,
                }}>+ Upload</Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
                {[
                    { label: 'Total Receipts', value: receipts.length, icon: '🧾', color: 'var(--accent)' },
                    { label: 'Total Spent', value: `₹${totalSpent.toFixed(0)}`, icon: '💸', color: 'var(--success)' },
                    { label: 'Expiring Soon', value: expiringSoon, icon: '⏰', color: 'var(--danger)' },
                ].map(({ label, value, icon, color }) => (
                    <div key={label} style={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)', padding: '16px 20px',
                        boxShadow: 'var(--shadow)', display: 'flex',
                        justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <div>
                            <p style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '6px' }}>{label}</p>
                            <p style={{ fontSize: '22px', fontWeight: 700, color }}>{value}</p>
                        </div>
                        <span style={{ fontSize: '28px', opacity: 0.8 }}>{icon}</span>
                    </div>
                ))}
            </div>

            {/* Receipts list */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--muted)' }}>
                    Loading receipts...
                </div>
            ) : receipts.length === 0 ? (
                <div style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '60px 20px',
                    textAlign: 'center', boxShadow: 'var(--shadow)',
                }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>🧾</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '6px' }}>
                        No receipts yet
                    </h3>
                    <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '20px' }}>
                        Upload your first receipt to get started
                    </p>
                    <Link to="/upload" style={{
                        display: 'inline-block', background: 'var(--accent)', color: '#fff',
                        padding: '9px 20px', borderRadius: '20px', textDecoration: 'none',
                        fontSize: '14px', fontWeight: 600,
                    }}>Upload a Receipt</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {receipts.map(r => {
                        const cat = categoryColors[r.category] || categoryColors.Other
                        const hasWarranty = r.warranty_expiry && r.warranty_expiry !== 'None'
                        const daysLeft = hasWarranty
                            ? Math.ceil((new Date(r.warranty_expiry) - new Date()) / (1000 * 60 * 60 * 24))
                            : null

                        return (
                            <div key={r.id} style={{
                                background: 'var(--surface)', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)', padding: '16px 20px',
                                boxShadow: 'var(--shadow)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>{r.merchant}</span>
                                            <span style={{
                                                background: cat.bg, color: cat.color,
                                                padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500
                                            }}>{r.category}</span>
                                        </div>
                                        <p style={{ color: 'var(--muted)', fontSize: '12px' }}>
                                            {r.date !== 'None' ? r.date : 'Date unknown'} • Uploaded {new Date(r.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>
                                        ₹{r.amount}
                                    </span>
                                </div>

                                {/* Warranty section */}
                                <div style={{
                                    borderTop: '1px solid var(--border)', paddingTop: '12px',
                                    display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'
                                }}>
                                    <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>⏰ Warranty:</span>
                                    {hasWarranty ? (
                                        <span style={{
                                            fontSize: '12px', fontWeight: 500,
                                            color: daysLeft <= 30 ? 'var(--danger)' : 'var(--success)'
                                        }}>
                                            {r.warranty_expiry} ({daysLeft > 0 ? `${daysLeft} days left` : 'Expired'})
                                        </span>
                                    ) : (
                                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Not set</span>
                                    )}
                                    <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
                                        <input
                                            type="date"
                                            value={warrantyInputs[r.id] || ''}
                                            onChange={e => setWarrantyInputs(prev => ({ ...prev, [r.id]: e.target.value }))}
                                            style={{
                                                border: '1px solid var(--border)', borderRadius: '6px',
                                                padding: '4px 8px', fontSize: '12px',
                                                background: 'var(--bg2)', color: 'var(--text)',
                                            }}
                                        />
                                        <button
                                            onClick={() => handleWarrantySave(r.id)}
                                            style={{
                                                background: 'var(--accent)', color: '#fff',
                                                border: 'none', padding: '4px 12px',
                                                borderRadius: '6px', fontSize: '12px',
                                                fontWeight: 600, cursor: 'pointer',
                                            }}>Save</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Dashboard