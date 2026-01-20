# WAHA API Setup Script
# This script will configure WAHA session and webhook via API

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "           WAHA Automated Setup Script                     " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$wahaUrl = "http://localhost:3000"
$sessionName = "default"
$webhookUrl = "http://n8n:5678/webhook/whatsapp"

# WAHA credentials
$username = "admin"
$password = "d643bbc256e540c285c4189a1a7ca664"
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))

Write-Host "Step 1: Creating session '$sessionName'..." -ForegroundColor Yellow

# Create session
$createSessionBody = @{
    name   = $sessionName
    config = @{
        proxy    = $null
        webhooks = @(
            @{
                url           = $webhookUrl
                events        = @("message", "message.any", "session.status")
                hmac          = $null
                retries       = $null
                customHeaders = $null
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $headers = @{
        "Authorization" = "Basic $base64Auth"
        "Content-Type"  = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$wahaUrl/api/sessions" -Method Post -Body $createSessionBody -Headers $headers -ErrorAction Stop
    Write-Host "✅ Session created successfully!" -ForegroundColor Green
    Write-Host "   Session: $sessionName" -ForegroundColor White
    Write-Host ""
}
catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "⚠️  Session already exists, that's OK!" -ForegroundColor Yellow
        Write-Host ""
    }
    else {
        Write-Host "❌ Error creating session: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "Step 2: Starting session..." -ForegroundColor Yellow

try {
    $startResponse = Invoke-RestMethod -Uri "$wahaUrl/api/sessions/$sessionName/start" -Method Post -Headers $headers -ErrorAction Stop
    Write-Host "✅ Session started!" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "⚠️  Session may already be running: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Step 3: Getting QR Code..." -ForegroundColor Yellow

Start-Sleep -Seconds 3

try {
    $qrResponse = Invoke-RestMethod -Uri "$wahaUrl/api/sessions/$sessionName/auth/qr" -Method Get -Headers $headers -ErrorAction Stop
    
    if ($qrResponse.qr) {
        Write-Host "✅ QR Code retrieved!" -ForegroundColor Green
        Write-Host ""
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host "                    📱 SCAN THIS QR CODE                    " -ForegroundColor Cyan
        Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "QR Code Data:" -ForegroundColor Yellow
        Write-Host $qrResponse.qr -ForegroundColor White
        Write-Host ""
        Write-Host "Opening QR Code in browser..." -ForegroundColor Yellow
        
        # Create HTML file with QR code
        $qrHtml = @"
<!DOCTYPE html>
<html>
<head>
    <title>WAHA QR Code - Scan with WhatsApp</title>
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            color: #333;
        }
        h1 {
            color: #667eea;
            margin-bottom: 10px;
        }
        .phone-number {
            color: #25D366;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        #qrcode {
            margin: 20px auto;
            padding: 20px;
            background: white;
            border-radius: 10px;
        }
        .instructions {
            margin-top: 20px;
            text-align: left;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        .instructions h3 {
            color: #667eea;
            margin-top: 0;
        }
        .instructions ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        .instructions li {
            margin: 8px 0;
            color: #555;
        }
        .status {
            margin-top: 20px;
            padding: 15px;
            background: #fff3cd;
            border-radius: 8px;
            border-left: 4px solid #ffc107;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 WAHA WhatsApp Connection</h1>
        <div class="phone-number">📱 +55 81 8392-0320</div>
        
        <div id="qrcode"></div>
        
        <div class="instructions">
            <h3>📋 How to Connect:</h3>
            <ol>
                <li>Open <strong>WhatsApp Business</strong> on your phone</li>
                <li>Go to <strong>Settings → Linked Devices</strong></li>
                <li>Tap <strong>"Link a Device"</strong></li>
                <li><strong>Scan this QR Code</strong></li>
                <li>Wait for confirmation</li>
            </ol>
        </div>
        
        <div class="status">
            ⏳ Waiting for QR code scan...
        </div>
    </div>
    
    <script>
        const qrData = '$($qrResponse.qr)';
        QRCode.toCanvas(document.getElementById('qrcode'), qrData, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
        
        // Auto-refresh to check status
        setTimeout(() => {
            window.location.href = 'http://localhost:3000/dashboard';
        }, 60000); // Redirect to dashboard after 1 minute
    </script>
</body>
</html>
"@
        
        $qrHtml | Out-File -FilePath "qr-code.html" -Encoding UTF8
        Start-Process "qr-code.html"
        
        Write-Host "✅ QR Code opened in browser!" -ForegroundColor Green
        Write-Host ""
    }
    else {
        Write-Host "⚠️  No QR code available. Session may already be connected." -ForegroundColor Yellow
        Write-Host ""
    }
}
catch {
    Write-Host "⚠️  Could not get QR code: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   The session might already be authenticated." -ForegroundColor White
    Write-Host "   Check the WAHA dashboard: http://localhost:3000/dashboard" -ForegroundColor White
    Write-Host ""
}

Write-Host "Step 4: Configuring webhook..." -ForegroundColor Yellow

$webhookConfig = @{
    url    = $webhookUrl
    events = @("message", "message.any", "session.status")
} | ConvertTo-Json

try {
    $webhookResponse = Invoke-RestMethod -Uri "$wahaUrl/api/sessions/$sessionName/webhooks" -Method Post -Body $webhookConfig -Headers $headers -ErrorAction Stop
    Write-Host "✅ Webhook configured successfully!" -ForegroundColor Green
    Write-Host "   URL: $webhookUrl" -ForegroundColor White
    Write-Host "   Events: message, message.any, session.status" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host "⚠️  Webhook configuration: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "   You may need to configure it manually in the dashboard" -ForegroundColor White
    Write-Host ""
}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    Setup Summary                          " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Session '$sessionName' created/started" -ForegroundColor Green
Write-Host "📱 QR Code displayed (scan with WhatsApp)" -ForegroundColor Yellow
Write-Host "🔗 Webhook: $webhookUrl" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Scan the QR code with WhatsApp Business" -ForegroundColor White
Write-Host "2. Wait for status to show 'WORKING'" -ForegroundColor White
Write-Host "3. Check dashboard: http://localhost:3000/dashboard" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

Read-Host "Press Enter to close"
