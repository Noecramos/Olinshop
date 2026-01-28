import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'OlinShop';
    const subtitle = searchParams.get('subtitle') || 'Sua loja online favorita';
    const image = searchParams.get('image');

    // Default font setup (Inter for clean, premium look)
    // We can load fonts here if needed, but keeping it simple for speed first

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
                            opacity: 0.6,
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
                        height: '70%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                    }}
                />

                {/* Content Container */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        width: '100%',
                        height: '100%',
                        paddingBottom: '40px',
                        zIndex: 10,
                    }}
                >
                    {/* Store Name / Title */}
                    <div
                        style={{
                            fontSize: 60,
                            fontWeight: 900,
                            background: 'linear-gradient(to right, #fff, #f3f4f6)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: 10,
                            textAlign: 'center',
                            textShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        }}
                    >
                        {title}
                    </div>

                    {/* Subtitle / Description */}
                    <div
                        style={{
                            fontSize: 30,
                            color: '#e5e7eb',
                            textAlign: 'center',
                            maxWidth: '80%',
                            fontWeight: 500,
                        }}
                    >
                        {subtitle}
                    </div>

                    {/* Call to Action Badge */}
                    <div
                        style={{
                            marginTop: 30,
                            backgroundColor: '#FF1B8D', // Your brand accent color
                            color: 'white',
                            padding: '12px 30px',
                            borderRadius: '50px',
                            fontSize: 24,
                            fontWeight: 'bold',
                            boxShadow: '0 8px 16px rgba(255, 27, 141, 0.4)',
                        }}
                    >
                        Pedir Agora
                    </div>
                </div>

                {/* Top Logo Watermark (Optional) */}
                <div
                    style={{
                        position: 'absolute',
                        top: 30,
                        right: 30,
                        fontSize: 24,
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 'bold',
                        zIndex: 10,
                    }}
                >
                    🛍️ OlinShop
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
