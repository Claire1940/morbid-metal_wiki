'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ExternalLink,
  Heart,
  MapPin,
  MessageCircle,
  Sparkles,
  Swords,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  if (linkData) {
    const href = locale === 'en' ? linkData.url : `/${locale}${linkData.url}`
    return (
      <Link
        href={href}
        className={`${className || ''} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    )
  }
  return <>{children}</>
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
}

export default function HomePageClient({ latestArticles, moduleLinkMap, locale }: HomePageClientProps) {
  const t = useMessages() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://morbid-metal.wiki'

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: "Morbid Metal Wiki",
        description: "Complete Morbid Metal Wiki resource hub for characters, bosses, combos, upgrades, biomes, and progression guides.",
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Morbid Metal - Dark Sci-Fi Action Roguelite",
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: "Morbid Metal Wiki",
        alternateName: "Morbid Metal",
        url: siteUrl,
        description: "Complete Morbid Metal Wiki resource hub for characters, bosses, combos, upgrades, biomes, and progression guides",
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Morbid Metal Wiki - Dark Sci-Fi Action Roguelite",
        },
        sameAs: [
          'https://store.steampowered.com/app/1866130/Morbid_Metal/',
          'https://discord.com/invite/morbidmetal',
          'https://www.reddit.com/r/MorbidMetal/',
          'https://www.youtube.com/@PHO3LIX',
          'https://x.com/MorbidMetalGame',
        ],
      },
      {
        '@type': 'VideoGame',
        name: "Morbid Metal",
        gamePlatform: ['PC', 'Steam'],
        applicationCategory: 'Game',
        genre: ['Action', 'Roguelite', 'Hack and Slash', 'Sci-Fi'],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://store.steampowered.com/app/1866130/Morbid_Metal/',
        },
      },
    ],
  }

  // FAQ accordion states
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null)
  const [deckExpanded, setDeckExpanded] = useState<number | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      {/* <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => scrollToSection('beginner-guide')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.morbidmetalgame.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="PnokwmnxTdE"
              title="Morbid Metal - Official Early Access Trailer"
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID
              const sectionIds = [
                'beginner-guide', 'best-upgrades', 'best-skills-combos', 'characters-guide',
                'boss-guide', 'achievement-guide', 'combat-guide', 'how-to-heal',
                'builds-guide', 'release-roadmap', 'system-requirements', 'review-impressions',
                'demo-guide', 'flux-guide', 'ekku-guide', 'vekta-guide'
              ]
              const sectionId = sectionIds[index]

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group p-6 rounded-xl border border-border
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg mb-4
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors">
                    <DynamicIcon
                      name={card.icon}
                      className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalBeginnerGuide.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalBeginnerGuide']} locale={locale}>
                {t.modules.morbidMetalBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalBeginnerGuide.intro}</p>
          </div>
          <div className="scroll-reveal space-y-4 mb-10">
            {t.modules.morbidMetalBeginnerGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`morbidMetalBeginnerGuide::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground mb-3">{step.description}</p>
                  {step.takeaways && (
                    <ul className="space-y-1">
                      {step.takeaways.map((t2: string, ti: number) => (
                        <li key={ti} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          {t2}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.morbidMetalBeginnerGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Best Upgrades */}
      <section id="best-upgrades" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalBestUpgrades.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalBestUpgrades']} locale={locale}>
                {t.modules.morbidMetalBestUpgrades.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalBestUpgrades.intro}</p>
          </div>
          <div className="scroll-reveal space-y-3">
            {t.modules.morbidMetalBestUpgrades.items.map((item: any, index: number) => (
              <div key={index} className="flex gap-4 p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] flex items-center justify-center">
                  <span className="text-sm font-bold text-[hsl(var(--nav-theme-light))]">#{item.rank}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-base">
                      <LinkedTitle linkData={moduleLinkMap[`morbidMetalBestUpgrades::items::${index}`]} locale={locale}>
                        {item.upgrade}
                      </LinkedTitle>
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">{item.cost}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-border text-muted-foreground">{item.timing}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.why_it_matters}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Best Skills and Combos */}
      <section id="best-skills-combos" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalBestSkillsAndCombos.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalBestSkillsAndCombos']} locale={locale}>
                {t.modules.morbidMetalBestSkillsAndCombos.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalBestSkillsAndCombos.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.modules.morbidMetalBestSkillsAndCombos.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <h3 className="font-bold text-base text-[hsl(var(--nav-theme-light))]">
                    <LinkedTitle linkData={moduleLinkMap[`morbidMetalBestSkillsAndCombos::cards::${index}`]} locale={locale}>
                      {card.card_title}
                    </LinkedTitle>
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {card.best_picks.map((pick: string, pi: number) => (
                    <span key={pi} className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{pick}</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{card.why_it_works}</p>
                {card.key_data && (
                  <ul className="mt-3 space-y-1">
                    {card.key_data.map((d: string, di: number) => (
                      <li key={di} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />{d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Characters Guide */}
      <section id="characters-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalCharactersGuide.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalCharactersGuide']} locale={locale}>
                {t.modules.morbidMetalCharactersGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalCharactersGuide.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.modules.morbidMetalCharactersGuide.characters.map((char: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border-2 border-[hsl(var(--nav-theme)/0.4)] flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[hsl(var(--nav-theme-light))]">
                      <LinkedTitle linkData={moduleLinkMap[`morbidMetalCharactersGuide::characters::${index}`]} locale={locale}>
                        {char.character}
                      </LinkedTitle>
                    </h3>
                    <p className="text-xs text-muted-foreground">{char.unlock_timing}</p>
                  </div>
                </div>
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-3">{char.role}</span>
                <ul className="space-y-1 mb-3">
                  {char.strengths.map((s: string, si: number) => (
                    <li key={si} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />{s}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-[hsl(var(--nav-theme-light))/0.8] italic border-t border-border pt-3">{char.team_flow}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 5: Boss Guide */}
      <section id="boss-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalBossGuide.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalBossGuide']} locale={locale}>
                {t.modules.morbidMetalBossGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-sm font-medium text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalBossGuide.subtitle}</p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalBossGuide.intro}</p>
          </div>
          <div className="scroll-reveal space-y-6">
            {t.modules.morbidMetalBossGuide.bosses.map((boss: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-4 p-5 bg-white/[0.03] border-b border-border">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] flex items-center justify-center">
                    <Swords className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{boss.boss}</h3>
                    <p className="text-xs text-muted-foreground">{boss.biome}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground mb-4">{boss.summary}</p>
                  <div className="space-y-3">
                    {boss.sections.map((sec: any, si: number) => (
                      <details key={si} className="group border border-border/60 rounded-lg overflow-hidden">
                        <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors list-none">
                          <span className="text-sm font-semibold text-[hsl(var(--nav-theme-light))]">{sec.label}</span>
                          <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform group-open:rotate-180 text-muted-foreground" />
                        </summary>
                        <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground">{sec.content}</div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Achievement Guide */}
      <section id="achievement-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalAchievementGuide.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalAchievementGuide']} locale={locale}>
                {t.modules.morbidMetalAchievementGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-sm font-medium text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalAchievementGuide.subtitle}</p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalAchievementGuide.intro}</p>
          </div>
          {/* Desktop table */}
          <div className="scroll-reveal hidden md:block overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.08)] border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold text-[hsl(var(--nav-theme-light))]">Achievement</th>
                  <th className="text-left px-4 py-3 font-semibold text-[hsl(var(--nav-theme-light))]">How to Unlock</th>
                  <th className="text-left px-4 py-3 font-semibold text-[hsl(var(--nav-theme-light))] whitespace-nowrap">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-[hsl(var(--nav-theme-light))]">Best Route</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.morbidMetalAchievementGuide.items.map((item: any, index: number) => (
                  <tr key={index} className={`border-b border-border/50 hover:bg-white/5 transition-colors ${index % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                    <td className="px-4 py-3 font-medium text-foreground">{item.achievement}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.unlock}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] whitespace-nowrap">{item.bucket}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{item.best_route}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile stacked cards */}
          <div className="scroll-reveal md:hidden space-y-3">
            {t.modules.morbidMetalAchievementGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-4 bg-white/5 border border-border rounded-xl">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-semibold text-sm text-foreground">{item.achievement}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] flex-shrink-0">{item.bucket}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1"><span className="font-medium text-foreground/70">Unlock:</span> {item.unlock}</p>
                <p className="text-xs text-muted-foreground"><span className="font-medium text-foreground/70">Route:</span> {item.best_route}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Combat Guide */}
      <section id="combat-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalCombatGuide.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalCombatGuide']} locale={locale}>
                {t.modules.morbidMetalCombatGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-sm font-medium text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalCombatGuide.subtitle}</p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalCombatGuide.intro}</p>
          </div>
          <div className="scroll-reveal space-y-3">
            {t.modules.morbidMetalCombatGuide.items.map((item: any, index: number) => (
              <details key={index} className="group border border-border rounded-xl overflow-hidden">
                <summary className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors list-none">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] flex items-center justify-center">
                      <Swords className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <div className="text-left min-w-0">
                      <p className="font-semibold truncate">{item.section}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.summary}</p>
                    </div>
                  </div>
                  <ChevronDown className="w-5 h-5 flex-shrink-0 transition-transform group-open:rotate-180 ml-3 text-muted-foreground" />
                </summary>
                <div className="px-5 pb-5 border-t border-border/50">
                  <ul className="space-y-2 mt-4">
                    {item.details.map((d: string, di: number) => (
                      <li key={di} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: How to Heal */}
      <section id="how-to-heal" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalHowToHeal.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalHowToHeal']} locale={locale}>
                {t.modules.morbidMetalHowToHeal.title}
              </LinkedTitle>
            </h2>
            <p className="text-sm font-medium text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalHowToHeal.subtitle}</p>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalHowToHeal.intro}</p>
          </div>
          <div className="scroll-reveal space-y-3">
            {t.modules.morbidMetalHowToHeal.items.map((item: any, index: number) => (
              <div key={index} className="flex gap-4 p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-semibold text-sm">{item.label}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${item.priority === 'High' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]'}`}>{item.priority}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1.5">{item.detail}</p>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{item.where}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 9: Builds Guide */}
      <section id="builds-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalBuildsGuide.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalBuildsGuide']} locale={locale}>
                {t.modules.morbidMetalBuildsGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalBuildsGuide.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.modules.morbidMetalBuildsGuide.builds.map((build: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  {build.tier && (
                    <span className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold border-2 ${build.tier === 'S' ? 'bg-amber-500/20 border-amber-500/60 text-amber-400' : 'bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.5)] text-[hsl(var(--nav-theme-light))]'}`}>
                      {build.tier}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-base text-[hsl(var(--nav-theme-light))] leading-tight">
                      <LinkedTitle linkData={moduleLinkMap[`morbidMetalBuildsGuide::builds::${index}`]} locale={locale}>
                        {build.name}
                      </LinkedTitle>
                    </h3>
                    <p className="text-xs text-muted-foreground">{build.playstyle}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {build.core_skills.map((s: string, si: number) => (
                    <span key={si} className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{s}</span>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground flex-1 mb-3">{build.description}</p>
                {build.best_for && (
                  <div className="border-t border-border/50 pt-3">
                    <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] mb-1">Best for</p>
                    <ul className="space-y-0.5">
                      {build.best_for.map((b: string, bi: number) => (
                        <li key={bi} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 10: Release Date and Roadmap */}
      <section id="release-roadmap" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalReleaseDateRoadmap.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalReleaseDateRoadmap']} locale={locale}>
                {t.modules.morbidMetalReleaseDateRoadmap.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalReleaseDateRoadmap.intro}</p>
          </div>
          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-8">
            {t.modules.morbidMetalReleaseDateRoadmap.entries.map((entry: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background z-10" />
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full border ${entry.status === 'released' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : entry.status === 'tba' ? 'bg-white/5 border-border text-muted-foreground' : 'bg-sky-500/10 border-sky-500/30 text-sky-400'}`}>{entry.date}</span>
                  </div>
                  <h3 className="font-bold mb-1">
                    <LinkedTitle linkData={moduleLinkMap[`morbidMetalReleaseDateRoadmap::entries::${index}`]} locale={locale}>
                      {entry.event}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground text-sm">{entry.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 11: System Requirements */}
      <section id="system-requirements" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalSystemRequirements.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalSystemRequirements']} locale={locale}>
                {t.modules.morbidMetalSystemRequirements.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalSystemRequirements.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {t.modules.morbidMetalSystemRequirements.specs.map((spec: any, index: number) => (
              <div key={index} className={`p-6 border rounded-xl ${index === 1 ? 'border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.05)]' : 'border-border bg-white/5'}`}>
                <h3 className={`font-bold text-lg mb-4 ${index === 1 ? 'text-[hsl(var(--nav-theme-light))]' : ''}`}>{spec.tier}</h3>
                <div className="space-y-2 text-sm">
                  {[['OS', spec.os], ['CPU', spec.cpu], ['GPU', spec.gpu], ['RAM', spec.ram], ['Storage', spec.storage], ['DirectX', spec.directx]].map(([label, value]) => (
                    <div key={label} className="flex gap-2">
                      <span className="text-muted-foreground w-16 flex-shrink-0">{label}</span>
                      <span className="text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-reveal p-5 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <ul className="space-y-2">
              {t.modules.morbidMetalSystemRequirements.notes.map((note: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />{note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 12: Review and Impressions */}
      <section id="review-impressions" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalReviewImpressions.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalReviewImpressions']} locale={locale}>
                {t.modules.morbidMetalReviewImpressions.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalReviewImpressions.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.modules.morbidMetalReviewImpressions.reviews.map((review: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-[hsl(var(--nav-theme)/0.15)] flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{review.source}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${review.verdict === 'Positive' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : review.verdict === 'Promising' ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>{review.verdict}</span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-emerald-400 mb-2">Highlights</p>
                    <ul className="space-y-1">
                      {review.highlights.map((h: string, hi: number) => (
                        <li key={hi} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />{h}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-400 mb-2">Watch For</p>
                    <ul className="space-y-1">
                      {review.watchouts.map((w: string, wi: number) => (
                        <li key={wi} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />{w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 13: Demo Guide */}
      <section id="demo-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalDemoGuide.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalDemoGuide']} locale={locale}>
                {t.modules.morbidMetalDemoGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalDemoGuide.intro}</p>
          </div>
          <div className="scroll-reveal space-y-2">
            {t.modules.morbidMetalDemoGuide.faqs.map((faq: any, index: number) => (
              <details key={index} className="group border border-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/5 transition-colors list-none">
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 flex-shrink-0 transition-transform group-open:rotate-180 ml-3" />
                </summary>
                <div className="px-5 pb-5 text-muted-foreground text-sm">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Module 14: Flux Guide */}
      <section id="flux-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalFluxGuide.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalFluxGuide']} locale={locale}>
                {t.modules.morbidMetalFluxGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalFluxGuide.subtitle}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.modules.morbidMetalFluxGuide.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-base text-[hsl(var(--nav-theme-light))] mb-3">
                  <LinkedTitle linkData={moduleLinkMap[`morbidMetalFluxGuide::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 15: Ekku Guide */}
      <section id="ekku-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalEkkuGuide.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalEkkuGuide']} locale={locale}>
                {t.modules.morbidMetalEkkuGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalEkkuGuide.subtitle}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.modules.morbidMetalEkkuGuide.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-base text-[hsl(var(--nav-theme-light))] mb-3">
                  <LinkedTitle linkData={moduleLinkMap[`morbidMetalEkkuGuide::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 16: Vekta Guide */}
      <section id="vekta-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[hsl(var(--nav-theme-light))] mb-3">{t.modules.morbidMetalVektaGuide.eyebrow}</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['morbidMetalVektaGuide']} locale={locale}>
                {t.modules.morbidMetalVektaGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.morbidMetalVektaGuide.subtitle}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-5">
            {t.modules.morbidMetalVektaGuide.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-base text-[hsl(var(--nav-theme-light))] mb-3">
                  <LinkedTitle linkData={moduleLinkMap[`morbidMetalVektaGuide::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/morbidmetal"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/MorbidMetalGame"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/1866130"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/1866130/Morbid_Metal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
