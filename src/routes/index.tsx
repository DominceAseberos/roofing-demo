import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ROOFING_CONFIG } from '../config/roofingConfig'
import { scrollToSection } from '../lib/scroll'
import { SmoothScroll } from '../components/SmoothScroll'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { Marquee } from '../components/Marquee'
import { Manifesto } from '../components/Manifesto'
import { ServicesSection } from '../components/ServicesSection'
import { ProjectStory } from '../components/ProjectStory'
import { FinancingSection } from '../components/FinancingSection'
import { PaymentElementsSection } from '../components/PaymentElementsSection'
import { EstimateFormSection } from '../components/EstimateFormSection'
import { WorkflowSimulator } from '../components/WorkflowSimulator'
import { ServiceAreaSection } from '../components/ServiceAreaSection'
import { TestimonialsSection } from '../components/TestimonialsSection'
import { FinalCta } from '../components/FinalCta'
import { Footer } from '../components/Footer'
import { PixelEventHUD } from '../components/PixelEventHUD'

export const Route = createFileRoute('/')({
  component: RoofingHomePage,
})

function RoofingHomePage() {
  const { plans } = ROOFING_CONFIG
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans.deposit.id)
  const [preselectedService, setPreselectedService] = useState<string | undefined>()

  const handleOpenCheckout = (planId: string) => {
    setSelectedPlanId(planId)
    scrollToSection('plans')
  }

  const handleOpenEstimate = (serviceTitle?: string) => {
    if (serviceTitle) setPreselectedService(serviceTitle)
    scrollToSection('estimate')
  }

  return (
    <SmoothScroll>
      <div className="site" id="top">
        <Header onOpenEstimate={() => handleOpenEstimate()} />

        <main>
          <Hero
            onOpenCheckout={handleOpenCheckout}
            onOpenEstimate={() => handleOpenEstimate()}
          />

          <Marquee />

          <Manifesto />

          <ServicesSection
            onSelectPlan={handleOpenCheckout}
            onOpenEstimate={handleOpenEstimate}
          />

          <ProjectStory onOpenEstimate={() => handleOpenEstimate()} />

          <FinancingSection
            onOpenEstimate={() => handleOpenEstimate()}
            onOpenCheckout={handleOpenCheckout}
          />

          <PaymentElementsSection
            selectedPlanId={selectedPlanId}
            onPlanChange={setSelectedPlanId}
          />

          <EstimateFormSection
            preselectedService={preselectedService}
            onOpenCheckout={handleOpenCheckout}
          />

          <WorkflowSimulator onOpenCheckout={handleOpenCheckout} />

          <ServiceAreaSection />

          <TestimonialsSection />

          <FinalCta onOpenEstimate={() => handleOpenEstimate()} />
        </main>

        <Footer />

        <PixelEventHUD />
      </div>
    </SmoothScroll>
  )
}
