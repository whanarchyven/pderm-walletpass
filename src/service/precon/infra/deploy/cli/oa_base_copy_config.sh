#!/bin/bash

# список объектов (файлов и директорий): локальный путь и удаленный путь
declare -A objects=(["etc/traefik"]="/etc/traefik")
#    ["file2.txt"]="/remote/path/file2.txt"
#    ["dir1"]="/remote/path/dir1"
#    ["dir2"]="/remote/path/dir2"
    # и так далее

LOCAL_PREFIX="/Users/nickerlan/ww/www/vpn/nick/shared/FHS/usr/src/node/ts/next/dist/cloudvps-by/ina/base_2_4"
REMOTE_USER="root"
REMOTE_IP="185.251.38.148"

for local_suffix in "${!objects[@]}"; do
    local="$LOCAL_PREFIX/$local_suffix"
    remote=${objects[$local_suffix]}
    ssh "$REMOTE_USER@$REMOTE_IP" mkdir -p "${remote%/*}"
    if [[ -d $local ]]; then
        scp -r "$local" "$REMOTE_USER@$REMOTE_IP:$remote"
    else
        scp "$local" "$REMOTE_USER@$REMOTE_IP:$remote"
    fi
done
