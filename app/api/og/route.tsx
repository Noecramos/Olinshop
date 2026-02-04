import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'LojAky';
    const subtitle = searchParams.get('subtitle') || 'Sua loja online favorita';
    const image = searchParams.get('image'); // Banner
    const logo = searchParams.get('logo');   // Store Logo

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    position: 'relative',
                }}
            >
                {/* Background Image / Banner */}
                {image ? (
                    <img
                        src={image}
                        alt="Background"
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.5,
                        }}
                    />
                ) : (
                    <div
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(to bottom right, #fce7f3, #e0e7ff)',
                        }}
                    />
                )}

                {/* Dark Overlay Gradient for text readability */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
                    }}
                />

                {/* Content Container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                        padding: '40px',
                    }}
                >
                    {/* Store Logo - Prominent Circle */}
                    {logo && (
                        <div style={{
                            display: 'flex',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '8px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                            marginBottom: '20px',
                            width: '200px',
                            height: '200px',
                            background: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <img
                                src={logo}
                                alt="Logo"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                }}
                            />
                        </div>
                    )}

                    {/* Store Name / Title */}
                    <div
                        style={{
                            fontSize: 70,
                            fontWeight: 900,
                            color: 'white',
                            marginBottom: 10,
                            textAlign: 'center',
                            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            lineHeight: 1.1,
                        }}
                    >
                        {title}
                    </div>

                    {/* Subtitle / Description */}
                    <div
                        style={{
                            fontSize: 32,
                            color: '#e5e7eb',
                            textAlign: 'center',
                            maxWidth: '90%',
                            fontWeight: 500,
                            marginBottom: 40,
                        }}
                    >
                        {subtitle}
                    </div>

                    {/* Call to Action Badge */}
                    <div
                        style={{
                            backgroundColor: '#FF1B8D', // Your brand accent color
                            color: 'white',
                            padding: '16px 48px',
                            borderRadius: '50px',
                            fontSize: 32,
                            fontWeight: 'bold',
                            boxShadow: '0 10px 25px rgba(255, 27, 141, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        🛍️ Pedir Agora no LojAky
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
