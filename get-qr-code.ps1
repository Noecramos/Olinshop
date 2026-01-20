# Get WAHA QR Code
$wahaUrl = "http://localhost:3000"
$sessionName = "default"
$username = "admin"
$password = "d643bbc256e540c285c4189a1a7ca664"

# Create auth header
$pair = "$($username):$($password)"
$encodedCreds = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($pair))
$headers = @{
    Authorization = "Basic $encodedCreds"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Getting QR Code from WAHA..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    # Get QR code
    $qr = Invoke-RestMethod -Uri "$wahaUrl/api/sessions/$sessionName/auth/qr" -Method Get -Headers $headers
    
    if ($qr.qr) {
        Write-Host "✅ QR Code found!" -ForegroundColor Green
        Write-Host ""
        
        # Create HTML page with QR code
        $html = @"
<!DOCTYPE html>
<html>
<head>
    <title>WAHA QR Code - Scan Now!</title>
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 30px;
            padding: 50px;
            box-shadow: 0 30px 80px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }
        h1 {
            color: #667eea;
            font-size: 36px;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .phone-number {
            color: #25D366;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 30px;
        }
        #qrcode {
            background: white;
            padding: 30px;
            border-radius: 20px;
            display: inline-block;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            margin: 20px 0;
        }
        .instructions {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 15px;
            margin-top: 30px;
            text-align: left;
            border-left: 5px solid #667eea;
        }
        .instructions h2 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 22px;
        }
        .instructions ol {
            margin: 0;
            padding-left: 25px;
        }
        .instructions li {
            margin: 12px 0;
            color: #555;
            font-size: 16px;
            line-height: 1.6;
        }
        .instructions strong {
            color: #333;
        }
        .alert {
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            color: #856404;
            font-size: 18px;
            font-weight: 600;
        }
        .emoji {
            font-size: 40px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="emoji">📱</div>
        <h1>SCAN THIS QR CODE</h1>
        <div class="phone-number">WhatsApp: +55 81 8392-0320</div>
        
        <div id="qrcode"></div>
        
        <div class="alert">
            ⏰ QR Code expires in 60 seconds - scan now!
        </div>
        
        <div class="instructions">
            <h2>📋 How to Scan:</h2>
            <ol>
                <li>Open <strong>WhatsApp Business</strong> on your phone</li>
                <li>Tap <strong>⋮ (menu)</strong> → <strong>Settings</strong></li>
                <li>Tap <strong>Linked Devices</strong></li>
                <li>Tap <strong>"Link a Device"</strong></li>
                <li><strong>Point your camera at this QR code</strong></li>
                <li>Wait for confirmation</li>
            </ol>
        </div>
    </div>
    
    <script>
        const qrData = '$($qr.qr)';
        const canvas = document.createElement('canvas');
        
        QRCode.toCanvas(canvas, qrData, {
            width: 350,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'H'
        }, function (error) {
            if (error) {
                console.error(error);
                document.getElementById('qrcode').innerHTML = '<p style="color: red;">Error generating QR code</p>';
            } else {
                document.getElementById('qrcode').appendChild(canvas);
            }
        });
        
        // Auto-refresh after 60 seconds
        setTimeout(function() {
            alert('QR Code expired! Refreshing...');
            window.location.reload();
        }, 60000);
    </script>
</body>
</html>
"@
        
        # Save HTML file
        $html | Out-File -FilePath "qr-code.html" -Encoding UTF8
        
        Write-Host "Opening QR Code in browser..." -ForegroundColor Yellow
        Start-Process "qr-code.html"
        
        Write-Host ""
        Write-Host "✅ QR Code opened in browser!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Scan it with WhatsApp Business now!" -ForegroundColor Yellow
        Write-Host ""
        
    }
    else {
        Write-Host "⚠️  No QR code available" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "This could mean:" -ForegroundColor White
        Write-Host "  1. Session is already connected" -ForegroundColor Gray
        Write-Host "  2. Session needs to be restarted" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Opening WAHA Dashboard..." -ForegroundColor Yellow
        Start-Process "http://localhost:3000/dashboard"
    }
    
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opening WAHA Dashboard instead..." -ForegroundColor Yellow
    Start-Process "http://localhost:3000/dashboard"
    Write-Host ""
    Write-Host "In the dashboard:" -ForegroundColor White
    Write-Host "  1. Click on 'default' session" -ForegroundColor Gray
    Write-Host "  2. Look for QR code or 'Get QR' button" -ForegroundColor Gray
    Write-Host "  3. If no QR, click 'Restart Session'" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
