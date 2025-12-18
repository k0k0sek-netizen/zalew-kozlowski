import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Zalew Kozłowski - Prywatne Łowisko No Kill'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #1a4d3a, #0f2e22)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                    color: 'white',
                    padding: '40px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                    }}
                >
                    {/* Simple visual representation of a fish or water */}
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.46 6-7 6s-7.06-2.53-8.5-6Z" />
                        <path d="M18 12v.5" />
                        <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
                        <path d="M7 12a12.5 12.5 0 0 1-1.11-5.68A2 2 0 0 0 4 5a2 2 0 0 0-1.8 2.75A12.59 12.59 0 0 0 4 15.65A2 2 0 0 0 7 14.93a2 2 0 0 0-.07-2.92Z" />
                    </svg>
                </div>
                <h1
                    style={{
                        fontSize: 64,
                        fontWeight: 800,
                        textAlign: 'center',
                        margin: 0,
                        marginBottom: 20,
                        background: 'linear-gradient(to right, #ffffff, #cfd8d3)',
                        backgroundClip: 'text',
                        color: 'transparent',
                    }}
                >
                    Zalew Kozłowski
                </h1>
                <p
                    style={{
                        fontSize: 32,
                        textAlign: 'center',
                        margin: 0,
                        color: '#e5e7eb',
                        maxWidth: '800px',
                    }}
                >
                    Piękne ryby. Cisza. Spokój. <br />
                    <span style={{ color: '#f97316', fontWeight: 'bold', marginTop: '10px', display: 'block' }}>Zasada No Kill</span>
                </p>
            </div>
        ),
        {
            ...size,
        }
    )
}
