import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck, Heart, Loader2 } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Container from '../components/ui/Container'
import { TextField, CheckboxField, FormSuccess } from '../components/forms/FormField'
import { donationSchema } from '../lib/schemas'
import { createDonationOrder, verifyDonationPayment, getActiveCampaign, getProjects } from '../lib/api'
import { formatINR } from '../lib/format'

const presetAmounts = [500, 1000, 2500, 5000]

// Loads the Razorpay checkout script on demand. In production this script
// is what opens the actual payment sheet once the backend has created a
// real order via /api/payments/create-order.
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function Donate() {
  const [searchParams] = useSearchParams()
  const preselectedProject = searchParams.get('project')
  const [selectedAmount, setSelectedAmount] = useState(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [status, setStatus] = useState('idle') // idle | processing | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const [activeCampaign, setActiveCampaign] = useState(null)
  const [projects, setProjects] = useState([])

  useEffect(() => {
    getActiveCampaign().then(setActiveCampaign).catch(() => setActiveCampaign(null))
    getProjects().then((res) => setProjects(res.items)).catch(() => setProjects([]))
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 1000,
      frequency: 'one-time',
      designation: preselectedProject ? 'project' : 'general',
      wants80G: false,
      anonymous: false,
      consent: false,
    },
  })

  // The preselected project comes from the URL as a slug (?project=slug),
  // but the form needs the project's real id — set it once the project
  // list has loaded from the backend.
  useEffect(() => {
    if (preselectedProject && projects.length) {
      const match = projects.find((p) => p.slug === preselectedProject)
      if (match) setValue('projectId', match.id)
    }
  }, [preselectedProject, projects, setValue])

  const designation = watch('designation')
  const wants80G = watch('wants80G')

  useEffect(() => {
    setValue('amount', selectedAmount)
  }, [selectedAmount, setValue])

  function pickPreset(amount) {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  function onCustomAmountChange(e) {
    const val = e.target.value.replace(/[^\d]/g, '')
    setCustomAmount(val)
    if (val) setSelectedAmount(Number(val))
  }

  async function onSubmit(data) {
    setStatus('processing')
    setErrorMessage('')
    try {
      const payload = {
        ...data,
        campaignId: data.designation === 'campaign' ? activeCampaign?.id : undefined,
      }
      const order = await createDonationOrder(payload)
      const scriptLoaded = await loadRazorpayScript()

      if (!scriptLoaded || !window.Razorpay) {
        setStatus('error')
        setErrorMessage('Could not load the payment gateway. Please check your connection and try again.')
        return
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Sahayog Foundation',
        description: data.designation === 'project' ? 'Project donation' : 'General fund donation',
        order_id: order.orderId,
        prefill: { name: data.fullName, email: data.email, contact: data.phone },
        theme: { color: '#1B3A34' },
        handler: async (response) => {
          try {
            await verifyDonationPayment(response)
            setStatus('success')
          } catch (err) {
            setStatus('error')
            setErrorMessage(err.message || 'Payment verification failed. If money was deducted, it will be auto-refunded.')
          }
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
      })
      rzp.open()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <Container className="pt-40 pb-24">
        <div className="mx-auto max-w-lg">
          <FormSuccess
            title="Thank you — your donation is confirmed"
            description="A confirmation email and receipt are on their way to your inbox. If you requested an 80G certificate, you can track its status from your donor dashboard."
          />
        </div>
      </Container>
    )
  }

  return (
    <>
      <Seo
        title="Donate"
        description="Make a one-time or recurring donation to Sahayog Foundation — to the general fund, or directly to a project."
        path="/donate"
      />
      <section className="bg-pine-800 pt-32 pb-16 text-white">
        <Container>
          <p className="text-sm font-medium text-marigold-300">Give directly</p>
          <h1 className="mt-3 max-w-xl text-display-md font-display font-medium">
            Every donation is tracked to the project it funds.
          </h1>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid max-w-3xl gap-10">
            {/* Amount */}
            <div>
              <h2 className="font-display text-xl text-pine-700">Choose an amount</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {presetAmounts.map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => pickPreset(amt)}
                    className={`rounded-sm border py-3.5 text-center font-medium transition-colors ${
                      selectedAmount === amt && !customAmount
                        ? 'border-marigold-500 bg-marigold-50 text-marigold-700'
                        : 'border-pine-100 text-pine-700 hover:border-pine-300'
                    }`}
                  >
                    {formatINR(amt)}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label htmlFor="custom-amount" className="text-sm text-moss">Or enter a custom amount</label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-moss">₹</span>
                  <input
                    id="custom-amount"
                    inputMode="numeric"
                    value={customAmount}
                    onChange={onCustomAmountChange}
                    placeholder="Enter amount"
                    className="w-full rounded-[3px] border border-pine-100 py-2.5 pl-8 pr-3.5 text-sm focus-visible:outline-marigold-500"
                  />
                </div>
              </div>
              {errors.amount && <p className="mt-2 text-sm text-alert">{errors.amount.message}</p>}
            </div>

            {/* Frequency */}
            <div>
              <h2 className="font-display text-xl text-pine-700">Frequency</h2>
              <div className="mt-4 flex gap-3">
                {['one-time', 'recurring'].map((freq) => (
                  <label
                    key={freq}
                    className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-sm border border-pine-100 py-3.5 text-sm font-medium text-pine-700 has-[:checked]:border-marigold-500 has-[:checked]:bg-marigold-50 has-[:checked]:text-marigold-700"
                  >
                    <input type="radio" value={freq} {...register('frequency')} className="sr-only" />
                    {freq === 'one-time' ? 'One-time' : 'Monthly recurring'}
                  </label>
                ))}
              </div>
            </div>

            {/* Designation */}
            <div>
              <h2 className="font-display text-xl text-pine-700">Where should this go?</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  { value: 'general', label: 'General fund' },
                  { value: 'project', label: 'A specific project' },
                  { value: 'campaign', label: 'Active campaign' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-pine-100 px-4 py-2 text-sm font-medium text-pine-700 has-[:checked]:border-marigold-500 has-[:checked]:bg-marigold-50 has-[:checked]:text-marigold-700"
                  >
                    <input type="radio" value={opt.value} {...register('designation')} className="sr-only" />
                    {opt.label}
                  </label>
                ))}
              </div>
              {designation === 'project' && (
                <select
                  {...register('projectId')}
                  className="mt-3 w-full rounded-[3px] border border-pine-100 px-3.5 py-2.5 text-sm"
                >
                  <option value="">Choose a project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              )}
              {designation === 'campaign' && activeCampaign && (
                <div className="mt-3 rounded-sm bg-pine-50 p-4 text-sm text-pine-700">{activeCampaign.title}</div>
              )}
              {designation === 'campaign' && !activeCampaign && (
                <p className="mt-3 text-sm text-moss">No active campaign right now — your donation will go to the general fund.</p>
              )}
            </div>

            {/* Donor details */}
            <div>
              <h2 className="font-display text-xl text-pine-700">Your details</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField label="Full name" name="fullName" register={register} error={errors.fullName} required />
                <TextField label="Email" name="email" type="email" register={register} error={errors.email} required />
                <TextField label="Phone" name="phone" register={register} error={errors.phone} required placeholder="98XXXXXXXX" />
              </div>

              <div className="mt-5 space-y-3">
                <CheckboxField label="I'd like an 80G tax receipt for this donation" name="wants80G" register={register} />
                {wants80G && (
                  <TextField
                    label="PAN"
                    name="pan"
                    register={register}
                    error={errors.pan}
                    placeholder="AAAAA1234A"
                    style={{ textTransform: 'uppercase' }}
                  />
                )}
                <CheckboxField label="Make this an anonymous donation" name="anonymous" register={register} />
                <CheckboxField
                  label="I consent to Sahayog Foundation contacting me about this donation and related updates."
                  name="consent"
                  register={register}
                  error={errors.consent}
                />
              </div>
            </div>

            <div className="rounded-sm border border-pine-100 bg-paper-dim p-5">
              <div className="flex items-center justify-between">
                <span className="text-moss">You're donating</span>
                <span className="font-display text-2xl text-pine-700">{formatINR(selectedAmount || 0)}</span>
              </div>
              <button
                type="submit"
                disabled={status === 'processing'}
                className="btn-primary mt-5 w-full justify-center disabled:opacity-60"
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 size={17} className="animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    <Heart size={16} /> Proceed to Payment
                  </>
                )}
              </button>
              {status === 'error' && (
                <p className="mt-3 text-center text-sm text-alert">
                  {errorMessage || 'Something went wrong. Please try again.'}
                </p>
              )}
              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-moss">
                <ShieldCheck size={14} /> Payments are processed securely via Razorpay. We never store your card details.
              </p>
            </div>
          </form>
        </Container>
      </section>
    </>
  )
}
