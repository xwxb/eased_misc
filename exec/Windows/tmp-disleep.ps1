# Turn off "when closing" sleep
powercfg -SETACVALUEINDEX SCHEME_CURRENT SUB_BUTTONS LIDACTION 0
powercfg -SETDCVALUEINDEX SCHEME_CURRENT SUB_BUTTONS LIDACTION 0

# Turn off timed sleep
powercfg -CHANGE -standby-timeout-ac 0
powercfg -CHANGE -standby-timeout-dc 0

# Restore after 30 minutes
Start-Sleep -s 1800

# Turn on "when closing" sleep
powercfg -SETACVALUEINDEX SCHEME_CURRENT SUB_BUTTONS LIDACTION 1
powercfg -SETDCVALUEINDEX SCHEME_CURRENT SUB_BUTTONS LIDACTION 1

# Turn on timed sleep
powercfg -CHANGE -standby-timeout-ac 30
powercfg -CHANGE -standby-timeout-dc 15


