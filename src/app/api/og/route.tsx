import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') ?? "Önce nene'ne sor.").slice(0, 140)
  const eyebrow = (searchParams.get('eyebrow') ?? 'nenenesor').slice(0, 40)
  const byline = searchParams.get('byline')?.slice(0, 80) ?? undefined
  const expertise = searchParams.get('expertise') ?? undefined

  const accent = '#C75D3F'
  const cream = '#FBF7F0'
  const ink = '#2A2520'
  const gold = '#D4A24C'

  const expertiseLabel = ({
    diyetisyen: 'Diyetisyen',
    ebe: 'Ebe',
    doktor: 'Doktor',
  } as const)[expertise as 'diyetisyen' | 'ebe' | 'doktor']

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: cream,
          color: ink,
          padding: 72,
          fontFamily: 'system-ui',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: accent,
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: accent,
            }}
          >
            {eyebrow}
          </div>
          {expertiseLabel ? (
            <div
              style={{
                fontSize: 22,
                padding: '6px 18px',
                border: `2px solid ${gold}`,
                color: ink,
                borderRadius: 999,
              }}
            >
              {expertiseLabel}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 72,
            lineHeight: 1.05,
            fontWeight: 500,
            fontFamily: 'serif',
            letterSpacing: -1,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 26,
            color: '#2A2520aa',
          }}
        >
          <div>{byline ? byline : "Önce nene'ne sor."}</div>
          <div style={{ fontFamily: 'serif', fontStyle: 'italic' }}>
            nenenesor.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
