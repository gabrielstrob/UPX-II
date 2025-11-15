# Water System - Frontend

Interface web para gerenciamento de consumo de água.

## 🚀 Tecnologias

- React 18
- TypeScript
- Vite
- React Router
- Axios
- Recharts (gráficos)
- Lucide React (ícones)

## 📋 Pré-requisitos

- Node.js 18+
- Backend rodando em http://localhost:8080

## 🔧 Instalação

```powershell
cd frontend
npm install
```

## ▶️ Executar

```powershell
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🏗️ Build

```powershell
npm run build
```

## 📁 Estrutura

```
src/
├── components/     # Componentes reutilizáveis
├── pages/          # Páginas da aplicação
├── services/       # Serviços de API
├── contexts/       # Contextos React
├── types/          # Tipos TypeScript
├── styles/         # Estilos globais
└── main.tsx        # Entry point
```

## 🔐 Autenticação

O sistema utiliza HTTP Basic Authentication. Faça login com email e senha cadastrados no backend.
