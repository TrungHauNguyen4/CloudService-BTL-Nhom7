#!/bin/bash
echo "Starting custom startup script..."
unset DOTNET_ROOT
unset DOTNET_SHARED_STORE
unset DOTNET_HOST_PATH
chmod +x /home/site/wwwroot/CloudService.WebApi
exec /home/site/wwwroot/CloudService.WebApi
