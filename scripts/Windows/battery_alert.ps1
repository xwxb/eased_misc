Add-Type -AssemblyName System.Windows.Forms

# Create the NotifyIcon object
$notifyIcon = New-Object System.Windows.Forms.NotifyIcon
$notifyIcon.Icon = [System.Drawing.SystemIcons]::Warning
$notifyIcon.BalloonTipTitle = "Battery Alert"

# Function to show a taskbar pop-up notification
function Show-PopupNotification {
    param($message)
    $notifyIcon.BalloonTipText = $message
    $notifyIcon.Visible = $true
    $notifyIcon.ShowBalloonTip(0)
    Start-Sleep -Seconds 5
    $notifyIcon.Visible = $false
}

# Function to check the battery status and show a pop-up if it exceeds 90%
function Check-BatteryStatus {
    $batteryInfo = Get-WmiObject -Query "SELECT EstimatedChargeRemaining, BatteryStatus FROM Win32_Battery" | Select-Object -First 1
    $chargePercent = $batteryInfo.EstimatedChargeRemaining
    $powerStatus = $batteryInfo.BatteryStatus

    if ($chargePercent -gt 90 -and $powerStatus -eq 2) {
        $message = "Battery level is above 90% ($chargePercent%) and is plugged in."
        Show-PopupNotification $message
    }
}

# Main loop to run the script every ten minutes
while ($true) {
    Check-BatteryStatus
    # Sleep for 10 minutes (600 seconds) before checking again
    Start-Sleep -Seconds 600
}

# Clean up the NotifyIcon object
$notifyIcon.Dispose()
