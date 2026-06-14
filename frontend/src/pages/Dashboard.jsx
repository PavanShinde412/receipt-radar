import { useEffect, useState } from 'react'
import { getReceipts, updateWarranty, deleteReceipt } from '../api/receipts'
import { Link } from 'react-router-dom'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const categoryColors = {
    Food: '#f59e0b',
    Electronics: '#3b82f6',
    Clothing: '#ec4899',
    Medical: '#10b981',
    Travel: '#8b5cf6',
    Utilities: '#f97316',
    Other: '#6b7280',
}

function Dashboard() {
    const [receipts, setReceipts] = useState([])
    const [loading, setLoading] = useState(true)
    const [warrantyInputs, setWarrantyInputs] = useState({})

    useEffect(() => { fetchReceipts() }, [])

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

    // Monthly spending data
    const monthlyData = receipts.reduce((acc, r) => {
        if (!r.date || r.date === 'None') return acc
        const month = new Date(r.date).toLocaleString('default', { month: 'short', year: '2-digit' })
        acc[month] = (acc[month] || 0) + (r.amount || 0)
        return acc
    }, {})

    const monthlyChartData = Object.entries(monthlyData)
        .map(([month, amount]) => ({ month, amount: parseFloat(amount.toFixed(0)) }))
        .slice(-6)

    // Category spending data
    const categoryData = receipts.reduce((acc, r) => {
        const cat = r.category || 'Other'
        acc[cat] = (acc[cat] || 0) + (r.amount || 0)
        return acc
    }, {})

    const categoryChartData = Object.entries(categoryData)
        .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(0)) }))
        .filter(d => d.value > 0)

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

            {/* Charts */}
            {receipts.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>

                    {/* Monthly spending bar chart */}
                    <div style={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)', padding: '20px',
                        boxShadow: 'var(--shadow)',
                    }}>
                        <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)', marginBottom: '16px' }}>
                            📅 Monthly Spending
                        </p>
                        {monthlyChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart data={monthlyChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted)' }} />
                                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} />
                                    <Tooltip
                                        formatter={(val) => [`₹${val}`, 'Spent']}
                                        contentStyle={{
                                            background: 'var(--surface)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Bar dataKey="amount" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>
                                No data yet
                            </p>
                        )}
                    </div>

                    {/* Category pie chart */}
                    <div style={{
                        background: 'var(--surface)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)', padding: '20px',
                        boxShadow: 'var(--shadow)',
                    }}>
                        <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)', marginBottom: '16px' }}>
                            🏷️ Spending by Category
                        </p>
                        {categoryChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie
                                        data={categoryChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={70}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {categoryChartData.map((entry) => (
                                            <Cell key={entry.name} fill={categoryColors[entry.name] || '#6b7280'} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(val) => [`₹${val}`, 'Spent']}
                                        contentStyle={{
                                            background: 'var(--surface)',
                                            border: '1px solid var(--border)',
                                            borderRadius: '8px',
                                            fontSize: '12px'
                                        }}
                                    />
                                    <Legend
                                        iconSize={10}
                                        iconType="circle"
                                        wrapperStyle={{ fontSize: '11px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={{ color: 'var(--muted)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }}>
                                No data yet
                            </p>
                        )}
                    </div>
                </div>
            )}

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
                        const cat = r.category || 'Other'
                        const catColor = categoryColors[cat] || '#6b7280'
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
                                            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                                                {r.merchant || 'Unknown'}
                                            </span>
                                            <span style={{
                                                background: catColor + '20',
                                                color: catColor,
                                                padding: '2px 10px', borderRadius: '20px',
                                                fontSize: '11px', fontWeight: 500
                                            }}>{cat}</span>
                                        </div>
                                        <p style={{ color: 'var(--muted)', fontSize: '12px' }}>
                                            {r.date !== 'None' ? r.date : 'Date unknown'} • Uploaded {new Date(r.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>
                                            ₹{r.amount || 0}
                                        </span>
                                        <button
                                            onClick={async () => {
                                                await deleteReceipt(r.id)
                                                fetchReceipts()
                                            }}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid var(--danger)',
                                                color: 'var(--danger)',
                                                borderRadius: '6px',
                                                padding: '4px 10px',
                                                fontSize: '12px',
                                                cursor: 'pointer',
                                                fontWeight: 500,
                                            }}>🗑️ Delete</button>
                                    </div>
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
            )
            }
        </div >
    )
}

export default Dashboard