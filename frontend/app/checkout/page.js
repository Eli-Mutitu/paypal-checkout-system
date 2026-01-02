'use client'

import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

export default function CheckoutPage() {
  const router = useRouter()
  const [amount, setAmount] = useState('25.00')
  const [currency, setCurrency] = useState('USD')
  const [description, setDescription] = useState('Product Purchase')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPayPal, setShowPayPal] = useState(false)

  // Validate PayPal Client ID
  if (!PAYPAL_CLIENT_ID) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="card max-w-2xl w-full">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Configuration Error
            </h1>
            <p className="text-gray-600 mb-4">
              PayPal Client ID is not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID in your .env.local file.
            </p>
            <a href="/" className="btn-primary inline-block">
              Go Back
            </a>
          </div>
        </div>
      </div>
    )
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    // Only allow valid decimal numbers
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value)
    }
  }

  const handleProceedToPayment = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    setError(null)
    setShowPayPal(true)
  }

  const createOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount).toFixed(2),
          currency,
          description,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create order')
      }

      const data = await response.json()
      console.log('✓ Order created:', data.orderID)
      return data.orderID
    } catch (err) {
      console.error('Error creating order:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const onApprove = async (data) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `${API_URL}/api/orders/capture/${data.orderID}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to capture payment')
      }

      const captureData = await response.json()
      console.log('✓ Payment captured:', captureData)

      // Redirect to success page with order details
      router.push(
        `/success?orderID=${captureData.orderID}&captureID=${captureData.captureID}&amount=${captureData.amount.value}&currency=${captureData.amount.currency_code}`
      )
    } catch (err) {
      console.error('Error capturing payment:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const onError = (err) => {
    console.error('PayPal error:', err)
    setError('An error occurred with PayPal. Please try again.')
    setLoading(false)
  }

  const onCancel = () => {
    console.log('Payment cancelled by user')
    router.push('/cancel')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="card max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Purchase
          </h1>
          <p className="text-gray-600">
            Secure checkout powered by PayPal
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-600 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {!showPayPal ? (
          /* Order Form */
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-semibold">
                  $
                </span>
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="input pl-8"
                  placeholder="25.00"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input"
                disabled={loading}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
                placeholder="Product or service description"
                disabled={loading}
              />
            </div>

            {/* Order Summary */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Item:</span>
                  <span className="font-medium text-gray-900">{description}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-gray-900">
                    {amount} {currency}
                  </span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total:</span>
                    <span className="font-bold text-lg text-blue-600">
                      {amount} {currency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              className="btn-primary w-full text-lg"
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>

            <a href="/" className="block text-center">
              <button className="btn-secondary w-full">
                Cancel
              </button>
            </a>
          </div>
        ) : (
          /* PayPal Buttons */
          <div>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Order Total</h3>
              <p className="text-3xl font-bold text-blue-600">
                {amount} {currency}
              </p>
            </div>

            <PayPalScriptProvider
              options={{
                clientId: PAYPAL_CLIENT_ID,
                currency: currency,
                intent: 'capture',
              }}
            >
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  color: 'blue',
                  shape: 'rect',
                  label: 'pay',
                }}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
                onCancel={onCancel}
                disabled={loading}
              />
            </PayPalScriptProvider>

            <button
              onClick={() => setShowPayPal(false)}
              className="btn-secondary w-full mt-4"
              disabled={loading}
            >
              ← Back to Order Details
            </button>
          </div>
        )}

        {/* Security Badge */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <svg
              className="w-5 h-5 text-green-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Secure payment processing with SSL encryption
          </div>
        </div>
      </div>
    </main>
  )
}

