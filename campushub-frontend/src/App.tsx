
import { useEffect, useState } from 'react'
import './App.css'

type Product = {
  id: number
  name: string
  price: number
  description: string
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function loadProducts() {
    const response = await fetch('/api/products')
    if (!response.ok) {
      throw new Error('Failed to load products')
    }
    const data: Product[] = await response.json()
    setProducts(data)
  }

  useEffect(() => {
    loadProducts().catch(err => setError(err.message))
  }, [])

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    setError('')

    const numericPrice = Number(price)

    if (!name.trim() || !price.trim() ||
        !Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError('Please enter a name and a positive price.')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          price: numericPrice,
          description,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to publish product')
      }

      await loadProducts()
      setName('')
      setPrice('')
      setDescription('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
      <main>
        <h1>CampusHub Marketplace</h1>
        <p>Buy and sell items on campus!</p>

        <h2>Publish a Product</h2>

        <form onSubmit={handleSubmit}>
          <input
              placeholder="Product name"
              value={name}
              onChange={e => setName(e.target.value)}
          />

          <input
              type="number"
              placeholder="Price ($)"
              min="0.01"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
          />

          <textarea
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
          />

          <button type="submit" disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish Product'}
          </button>
        </form>

        {error && <p role="alert">{error}</p>}

        <h2>Available Products</h2>

        {products.map(product => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>{product.description}</p>
            </div>
        ))}
      </main>
  )
}

export default App
