import os
import paramiko

# Список объектов (файлов и директорий): локальный путь и удаленный путь
objects = {
    "etc/traefik": "/etc/traefik",
    # "file2.txt": "/remote/path/file2.txt",
    # "dir1": "/remote/path/dir1",
    # "dir2": "/remote/path/dir2",
    # и так далее
}

local_prefix = "/Users/nickerlan/ww/www/vpn/nick/shared/FHS/usr/src/node/ts/next/dist/cloudvps-by/ina/base_2_4"
remote_user = "root"
remote_ip = "185.251.38.148"
password = ""  # Замените на свой пароль

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(remote_ip, username=remote_user, password=password)

sftp = ssh.open_sftp()

for local_suffix, remote in objects.items():
    local = os.path.join(local_prefix, local_suffix)

    # Если локальный путь - это директория
    if os.path.isdir(local):
        # Рекурсивно копировать все файлы и поддиректории
        for dirpath, dirnames, filenames in os.walk(local):
            remote_dirpath = os.path.join(remote, os.path.relpath(dirpath, local))
            try:
                sftp.stat(remote_dirpath)
            except FileNotFoundError:
                # Создать удаленную директорию, если она не существует
                sftp.mkdir(remote_dirpath)
            for filename in filenames:
                sftp.put(os.path.join(dirpath, filename), os.path.join(remote_dirpath, filename))
    else:  # Если локальный путь - это файл
        try:
            sftp.put(local, remote)
        except FileNotFoundError:
            print(f"File not found: {local}")

sftp.close()
ssh.close()
