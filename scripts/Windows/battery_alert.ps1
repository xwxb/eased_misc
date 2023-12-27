Add-Type -AssemblyName System.Windows.Forms

# Function to show a taskbar pop-up notification
function Show-PopupNotification {
    param($message)
    $notifyIcon = New-Object System.Windows.Forms.NotifyIcon
    $notifyIcon.Icon = [System.Drawing.SystemIcons]::Warning
    $notifyIcon.BalloonTipText = $message
    $notifyIcon.BalloonTipTitle = "Battery Alert"
    $notifyIcon.Visible = $true
    $notifyIcon.ShowBalloonTip(0)
    Start-Sleep -Seconds 5
    $notifyIcon.Dispose()
}

# Function to check the battery status and show a pop-up if it exceeds 90%
function Check-BatteryStatus {
    $batteryInfo = Get-WmiObject -Class Win32_Battery
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
