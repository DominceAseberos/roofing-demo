import { createServerFn } from '@tanstack/react-start'
import { ROOFING_CONFIG } from '../config/roofingConfig'

export interface LeadSubmissionPayload {
  name: string
  email: string
  phone: string
  address: string
  city?: string
  state?: string
  zip: string
  roofAge?: string
  serviceType: string
  insuranceClaim?: boolean
  notes?: string
  estimatedValue?: number
}

export interface LeadSubmissionResult {
  success: boolean
  leadId: string
  accountId: string
  eventName: string
  registeredAt: string
  message: string
  live: boolean
}

export interface CreateInvoicePayload {
  customerName: string
  email: string
  planId: string
  planTitle?: string
  amount: number
  depositCredited?: number
  paymentMethodId?: string
  jobAddress?: string
  jobSummary?: string
  dueInDays?: number
  billingAddress?: {
    name?: string
    line1: string
    line2?: string
    city: string
    state?: string
    postalCode: string
    country: string
  }
}

export interface CreateInvoiceResult {
  success: boolean
  invoiceId: string
  accountId: string
  amountDue: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'scheduled'
  customerName: string
  email: string
  items: Array<{
    title: string
    variantId: string
    amount: number
    quantity: number
  }>
  paymentMethodId?: string | null
  chargeStrategy: 'auto_charge_stored_card' | 'sent_for_manual_payment'
  paymentUrl: string
  createdAt: string
  receiptNote: string
  live: boolean
}

async function getWhopClient() {
  // WHOP_API_KEY is reserved by the Whop hosted runtime. Use a namespaced
  // secret so account keys are not overwritten by the platform binding.
  const token =
    (typeof process !== 'undefined' ? process.env?.ROOFING_WHOP_API_KEY : undefined) ||
    (typeof process !== 'undefined' ? process.env?.WHOP_ACCOUNT_API_KEY : undefined) ||
    (typeof process !== 'undefined' ? process.env?.WHOP_API_KEY : undefined)

  if (!token) return null

  try {
    const { WhopClient } = await import('@whop/sdk')
    return new WhopClient({ token })
  } catch (error) {
    console.warn('[WhopClient initialization failed]', error)
    return null
  }
}

function makeLeadReference() {
  return `lead_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

function makeLocalId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Server function: writes the estimate request to Whop's Events API as a lead.
 * The browser never sees the API key. If no key is configured, the function
 * returns a clearly-marked preview receipt instead of pretending a live write occurred.
 */
export const submitRoofingLead = createServerFn({ method: 'POST' })
  .validator((payload: LeadSubmissionPayload) => payload)
  .handler(async ({ data: payload }): Promise<LeadSubmissionResult> => {
    const accountId = ROOFING_CONFIG.company.whopAccountId
    const eventId = makeLocalId('evt_lead')
    const localLeadId = makeLeadReference()
    const registeredAt = new Date().toISOString()
    const fullAddress = `${payload.address}, ${payload.city || 'Austin'}, ${payload.state || 'TX'} ${payload.zip}`
    const client = await getWhopClient()

    if (client) {
      try {
        const response = await client.events.create({
          account_id: accountId,
          event_name: 'lead',
          action_source: 'website',
          event_id: eventId,
          value: payload.estimatedValue || 8500,
          currency: 'usd',
          // The Events API schema carries identity fields; the property address is
          // attached to the source URL so it remains available for lead review.
          url: `https://${ROOFING_CONFIG.company.appDomain}/?${new URLSearchParams({
            lead_address: fullAddress,
            lead_service: payload.serviceType,
          }).toString()}`,
          context: {
            utm_source: 'website',
            utm_medium: 'estimate_form',
            utm_campaign: 'roofing_estimate',
          },
          user: {
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            city: payload.city || 'Austin',
            state: payload.state || 'TX',
            postal_code: payload.zip,
          },
        })

        return {
          success: true,
          leadId: response.id || localLeadId,
          accountId,
          eventName: 'lead',
          registeredAt,
          message: `Lead written to Whop account ${accountId}.`,
          live: true,
        }
      } catch (error: any) {
        console.warn('[Whop Events API lead write failed]', error?.message || error)
      }
    }

    return {
      success: true,
      leadId: localLeadId,
      accountId,
      eventName: 'lead',
      registeredAt,
      message: client
        ? `Whop Events API was unavailable; lead captured locally for account ${accountId}.`
        : `Preview mode: add WHOP_API_KEY to write this lead to account ${accountId}.`,
      live: false,
    }
  })

/**
 * Server function: creates the final project-balance invoice with the Whop
 * Invoices API. The final invoice needs a variant whose price represents the
 * remaining balance; set WHOP_FINAL_INVOICE_VARIANT_ID in production. Without
 * it, the function returns a preview invoice so the workflow stays demonstrable.
 */
export const createFinalRoofingInvoice = createServerFn({ method: 'POST' })
  .validator((payload: CreateInvoicePayload) => payload)
  .handler(async ({ data: payload }): Promise<CreateInvoiceResult> => {
    const accountId = ROOFING_CONFIG.company.whopAccountId
    const finalAmount = Math.max(0, payload.amount - (payload.depositCredited || 0))
    const chargeStrategy: CreateInvoiceResult['chargeStrategy'] = payload.paymentMethodId
      ? 'auto_charge_stored_card'
      : 'sent_for_manual_payment'
    const client = await getWhopClient()
    const variantId =
      (typeof process !== 'undefined'
        ? process.env?.ROOFING_FINAL_INVOICE_VARIANT_ID ||
          process.env?.WHOP_FINAL_INVOICE_VARIANT_ID
        : undefined) || null
    const unitAmount = Math.max(
      1,
      Number(
        typeof process !== 'undefined'
          ? process.env?.ROOFING_FINAL_INVOICE_UNIT_AMOUNT
          : undefined,
      ) || 1000,
    )
    const invoiceQuantity = Math.max(1, Math.round(finalAmount / unitAmount))
    const localInvoiceId = makeLocalId('inv')
    const createdAt = new Date().toISOString()
    const dueDate = new Date(Date.now() + (payload.dueInDays || 7) * 24 * 60 * 60 * 1000)

    if (client && variantId) {
      try {
        const created = await client.invoices.create({
          account_id: accountId,
          customer_name: payload.customerName,
          email_address: payload.email,
          items: [{ variant_id: variantId, quantity: invoiceQuantity }],
          payment_method_id: payload.paymentMethodId || undefined,
          billing_address: payload.billingAddress
            ? {
                name: payload.billingAddress.name || payload.customerName,
                line1: payload.billingAddress.line1,
                line2: payload.billingAddress.line2,
                city: payload.billingAddress.city,
                state: payload.billingAddress.state,
                postal_code: payload.billingAddress.postalCode,
                country: payload.billingAddress.country,
              }
            : undefined,
          due_at: payload.paymentMethodId
            ? new Date(Date.now() + 60 * 1000).toISOString()
            : dueDate.toISOString(),
          metadata: {
            job_summary: payload.jobSummary || 'Final balance for completed roof replacement',
            deposit_credited: `$${payload.depositCredited || 500}`,
            property_address: payload.jobAddress || 'Central Texas job site',
            source: 'apex-ridge-whop-template',
            invoice_units: String(invoiceQuantity),
          },
        })

        let fulfilled = created
        let deliveryError: string | null = null

        try {
          fulfilled = payload.paymentMethodId
            ? await client.invoices.issue({
                id: created.id,
                charge_at: new Date(Date.now() + 60 * 1000).toISOString(),
              })
            : await client.invoices.send({ id: created.id })
        } catch (error: any) {
          deliveryError = error?.message || 'Invoice delivery failed'
          console.warn('[Whop Invoices API delivery failed]', deliveryError)
        }

        return {
          success: true,
          invoiceId: created.id,
          accountId,
          amountDue: finalAmount,
          currency: 'USD',
          status: deliveryError ? 'draft' : payload.paymentMethodId ? 'scheduled' : 'open',
          customerName: payload.customerName,
          email: payload.email,
          items: [
            {
              title: payload.planTitle || 'Final contract balance',
              variantId,
              amount: finalAmount,
              quantity: invoiceQuantity,
            },
          ],
          paymentMethodId: payload.paymentMethodId || null,
          chargeStrategy,
          paymentUrl:
            fulfilled.checkout_link ||
            created.checkout_link ||
            `https://whop.com/discover/${encodeURIComponent(ROOFING_CONFIG.company.appDomain)}`,
          createdAt,
          receiptNote: deliveryError
            ? `Invoice ${created.id} was created as a draft, but delivery could not complete: ${deliveryError}`
            : payload.paymentMethodId
              ? `Invoice ${created.id} created and scheduled to charge the stored card on file via Whop.`
              : `Invoice ${created.id} created and emailed to ${payload.email} with the payable Whop link.`,
          live: true,
        }
      } catch (error: any) {
        console.warn('[Whop Invoices API live call failed]', error?.message || error)
      }
    }

    return {
      success: true,
      invoiceId: localInvoiceId,
      accountId,
      amountDue: finalAmount,
      currency: 'USD',
      status: payload.paymentMethodId ? 'paid' : 'open',
      customerName: payload.customerName,
      email: payload.email,
      items: [
        {
          title: payload.planTitle || 'Final contract balance',
          variantId: payload.planId,
          amount: payload.amount,
          quantity: 1,
        },
      ],
      paymentMethodId: payload.paymentMethodId || null,
      chargeStrategy,
      paymentUrl: `https://${ROOFING_CONFIG.company.appDomain}/invoice/${localInvoiceId}`,
      createdAt,
      receiptNote: payload.paymentMethodId
        ? `Preview: simulated charge to the stored card on file (${payload.paymentMethodId}). Set ROOFING_WHOP_API_KEY and ROOFING_FINAL_INVOICE_VARIANT_ID for a live invoice.`
        : `Preview: simulated payable link to ${payload.email}. Set ROOFING_WHOP_API_KEY and ROOFING_FINAL_INVOICE_VARIANT_ID for a live invoice.`,
      live: false,
    }
  })
