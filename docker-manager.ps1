# Script PowerShell para gerenciar o Docker do Sistema de Agendamentos
# Uso: .\docker-manager.ps1 [comando]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("start", "stop", "restart", "logs", "status", "backup", "reset", "dev", "prod", "help")]
    [string]$Command = "help",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("dev", "prod")]
    [string]$Mode = "dev"
)

function Show-Help {
    Write-Host "=== Sistema de Agendamentos - Gerenciador Docker ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Comandos disponíveis:" -ForegroundColor Yellow
    Write-Host "  dev      - Modo desenvolvimento (só banco, rode 'node index.js' separado)"
    Write-Host "  prod     - Modo produção (aplicação + banco em containers)"
    Write-Host "  start    - Inicia os serviços Docker"
    Write-Host "  stop     - Para os serviços Docker"
    Write-Host "  restart  - Reinicia os serviços Docker"
    Write-Host "  logs     - Exibe os logs dos serviços"
    Write-Host "  status   - Verifica o status dos containers"
    Write-Host "  backup   - Faz backup do banco de dados"
    Write-Host "  reset    - Para tudo e limpa os dados (CUIDADO!)"
    Write-Host "  help     - Exibe esta ajuda"
    Write-Host ""
    Write-Host "Exemplos:" -ForegroundColor Cyan
    Write-Host "  .\docker-manager.ps1 dev     # Desenvolvimento (só banco)"
    Write-Host "  .\docker-manager.ps1 prod    # Produção (app + banco)"
    Write-Host "  .\docker-manager.ps1 start   # Inicia modo atual"
}

function Start-Dev {
    Write-Host "Iniciando modo DESENVOLVIMENTO (só banco)..." -ForegroundColor Green
    docker-compose -f docker-compose.dev.yml up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Banco iniciado com sucesso!" -ForegroundColor Green
        Write-Host "MongoDB: localhost:27018" -ForegroundColor Cyan
        Write-Host "Mongo Express: http://localhost:8081" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Agora execute: node index.js" -ForegroundColor Yellow
    }
}

function Start-Prod {
    Write-Host "Iniciando modo PRODUÇÃO (app + banco)..." -ForegroundColor Green
    docker-compose up -d --build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Containers iniciados! Aguardando inicialização..." -ForegroundColor Green
        
        # Aguarda os containers estarem saudáveis
        Write-Host "Verificando saúde dos containers..." -ForegroundColor Yellow
        $timeout = 60  # segundos
        $elapsed = 0
        
        do {
            Start-Sleep -Seconds 5
            $elapsed += 5
            $status = docker-compose ps --format json | ConvertFrom-Json
            $healthy = $true
            
            foreach ($container in $status) {
                if ($container.Health -eq "unhealthy" -or ($container.State -ne "running")) {
                    $healthy = $false
                    break
                }
            }
            
            if ($elapsed -ge $timeout) {
                Write-Host "Timeout! Verifique os logs: docker-compose logs" -ForegroundColor Red
                return
            }
        } while (-not $healthy)
        
        Write-Host "Aplicação iniciada com sucesso!" -ForegroundColor Green
        Write-Host "Aplicação: http://localhost:8080" -ForegroundColor Cyan
        Write-Host "Mongo Express: http://localhost:8081" -ForegroundColor Cyan
        Write-Host "Usuário admin criado automaticamente!" -ForegroundColor Green
        Write-Host "Login: admin@clinic.com | Senha: admin123" -ForegroundColor Yellow
    }
}

function Start-Services {
    Write-Host "Iniciando serviços Docker..." -ForegroundColor Green
    docker-compose up -d
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Serviços iniciados com sucesso!" -ForegroundColor Green
        Write-Host "MongoDB: http://localhost:27017" -ForegroundColor Cyan
        Write-Host "Mongo Express: http://localhost:8081" -ForegroundColor Cyan
    } else {
        Write-Host "Erro ao iniciar os serviços!" -ForegroundColor Red
    }
}

function Stop-Services {
    Write-Host "Parando serviços Docker..." -ForegroundColor Yellow
    docker-compose down
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Serviços parados com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "Erro ao parar os serviços!" -ForegroundColor Red
    }
}

function Restart-Services {
    Write-Host "Reiniciando serviços Docker..." -ForegroundColor Yellow
    docker-compose restart
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Serviços reiniciados com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "Erro ao reiniciar os serviços!" -ForegroundColor Red
    }
}

function Show-Logs {
    Write-Host "Exibindo logs dos serviços..." -ForegroundColor Cyan
    docker-compose logs --tail=50 -f
}

function Show-Status {
    Write-Host "Status dos containers:" -ForegroundColor Cyan
    docker-compose ps
    Write-Host ""
    Write-Host "Uso de recursos:" -ForegroundColor Cyan
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
}

function Backup-Database {
    $backupDir = ".\backups\$(Get-Date -Format 'yyyyMMdd_HHmmss')"
    Write-Host "Criando backup em: $backupDir" -ForegroundColor Cyan
    
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    docker-compose exec -T mongodb mongodump --db agendamento --out /tmp/backup
    docker cp clinic_mongodb:/tmp/backup/agendamento $backupDir
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backup criado com sucesso em: $backupDir" -ForegroundColor Green
    } else {
        Write-Host "Erro ao criar backup!" -ForegroundColor Red
    }
}

function Reset-All {
    $confirmation = Read-Host "ATENÇÃO: Isso irá apagar todos os dados! Digite 'CONFIRMAR' para continuar"
    if ($confirmation -eq "CONFIRMAR") {
        Write-Host "Parando e removendo tudo..." -ForegroundColor Red
        docker-compose down -v
        docker system prune -f
        Write-Host "Reset completo realizado!" -ForegroundColor Green
    } else {
        Write-Host "Operação cancelada." -ForegroundColor Yellow
    }
}

# Executa o comando solicitado
switch ($Command) {
    "dev" { Start-Dev }
    "prod" { Start-Prod }
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "logs" { Show-Logs }
    "status" { Show-Status }
    "backup" { Backup-Database }
    "reset" { Reset-All }
    "help" { Show-Help }
    default { Show-Help }
}
