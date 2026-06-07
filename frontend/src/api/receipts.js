import axios from 'axios'

const API = 'http://localhost:8000/api'

export const uploadReceipt = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await axios.post(`${API}/upload`, formData)
    return res.data
}

export const getReceipts = async () => {
    const res = await axios.get(`${API}/receipts`)
    return res.data
}

export const updateWarranty = async (id, date) => {
    const res = await axios.patch(`${API}/receipts/${id}/warranty`, {
        warranty_expiry: date
    })
    return res.data
}