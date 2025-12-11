# BusSp - Frontend

Aplicativo mobile para rastreamento e gamificação de viagens de ônibus em São Paulo.

## 📋 Pré-requisitos

- **Node.js**: v24.8.0 ou superior
- **npm**: v10.0.0 ou superior (vem com Node.js)
- **Expo CLI**: v11.6.0 ou superior
- **EAS CLI**: Para builds de produção

```bash
# Instalar Expo CLI globalmente
npm install -g expo-cli

# Instalar EAS CLI globalmente
npm install -g eas-cli
```

## 🚀 Configuração Inicial

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd frontend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` de acordo com suas necessidades:

```env
# URL da API do backend
EXPO_PUBLIC_API_URL=http://SEU_IP:8000

# Google Maps API Key (obtenha em: https://console.cloud.google.com/google/maps-apis)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui

# Build configuration
# false: Para desenvolvimento com Expo Go (usa mapas nativos)
# true: Para builds APK/IPA (usa Google Maps no Android)
EXPO_PUBLIC_PARA_BUILD_APK=false
```

#### 📝 Configurando `EXPO_PUBLIC_API_URL`

Escolha a URL correta dependendo do seu ambiente:

- **Emulador Android**: `http://10.0.2.2:8000`
- **Expo Go no celular (mesma rede Wi-Fi)**: `http://SEU_IP_LOCAL:8000`
  - Para descobrir seu IP local:
    - Linux/Mac: `ifconfig` ou `ip addr`
    - Windows: `ipconfig`
- **Servidor de produção**: `https://api.seudominio.com`

#### 🗺️ Configurando Google Maps API Key

1. Acesse [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Crie um novo projeto ou selecione um existente
3. Ative a **Maps SDK for Android** e **Maps SDK for iOS**
4. Crie credenciais (API Key)
5. Copie a chave e cole em `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`

#### ⚙️ Configurando `EXPO_PUBLIC_PARA_BUILD_APK`

- **`false`**: Use durante desenvolvimento com Expo Go
  - Android usa mapas nativos
  - iOS usa Apple Maps
  - Não requer Google Maps API Key
  
- **`true`**: Use apenas para builds de produção (APK/IPA)
  - Android usa Google Maps (requer API Key)
  - iOS usa Apple Maps (não afetado)

## 🏃 Executando o Projeto

### Desenvolvimento com Expo Go

```bash
# Inicie o servidor de desenvolvimento
npm start

# Ou use atalhos específicos
npm run android    # Abre no emulador Android
npm run ios        # Abre no simulador iOS
npm run web        # Abre no navegador
```

**Importante**: Certifique-se de que `EXPO_PUBLIC_PARA_BUILD_APK=false` no `.env`

### Testando no dispositivo físico

1. Instale o app **Expo Go** ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))
2. Execute `npm start`
3. Escaneie o QR code com:
   - **Android**: App Expo Go
   - **iOS**: Câmera nativa do iPhone

## 📦 Build para Produção

### Configuração EAS (primeira vez)

```bash
# Login no EAS
eas login

# Configure o projeto
eas build:configure
```

### Build APK (Android)

1. **Configure o `.env` para build**:
   ```env
   EXPO_PUBLIC_PARA_BUILD_APK=true
   EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_aqui
   ```

2. **Build local** (mais rápido, requer Android SDK):
   ```bash
   eas build -p android --profile preview --local
   ```

3. **Build na nuvem** (não requer Android SDK):
   ```bash
   eas build -p android --profile preview
   ```

O APK será gerado e você receberá um link para download.

### Build IPA (iOS)

**Nota**: Build iOS requer conta Apple Developer ($99/ano)

```bash
# Build na nuvem (requer configuração de certificados)
eas build -p ios --profile preview
```

### Perfis de Build

Configurados em `eas.json`:

- **`development`**: Build de desenvolvimento com DevTools
- **`preview`**: Build de teste (usado para APK/IPA de teste)
- **`production`**: Build de produção para publicação nas lojas

## 🛠️ Tecnologias

- **TypeScript**: Tipagem estática
- **Expo**: Framework React Native
- **Expo Router**: Roteamento baseado em arquivos
- **React Query**: Gerenciamento de estado assíncrono
- **Axios**: Cliente HTTP
- **React Native Maps**: Mapas nativos e Google Maps
- **Expo Secure Store**: Armazenamento seguro de tokens
- **Bottom Sheet**: Interface de menu deslizante
- **EAS Build**: Sistema de build da Expo

## 📁 Estrutura do Projeto

```
frontend/
├── app/                          # Rotas e telas (Expo Router)
│   ├── _layout.tsx              # Layout raiz com autenticação
│   ├── index.tsx                # Tela inicial (mapa)
│   ├── login.tsx                # Tela de login
│   ├── register.tsx             # Tela de cadastro
│   ├── ranking.tsx              # Tela de ranking
│   └── components/              # Componentes das telas
│       ├── Map.tsx              # Componente principal do mapa
│       ├── BottomSheetMenu.tsx  # Menu de busca de linhas
│       ├── BusesLayer.tsx       # Camada de ônibus
│       └── BusStopsLayer.tsx    # Camada de pontos de parada
├── api/                         # Cliente API e hooks
│   └── src/
│       ├── client.ts            # Cliente Axios configurado
│       ├── hooks/               # React Query hooks
│       ├── models/              # Tipos TypeScript
│       ├── providers/           # Providers (Auth, Query)
│       └── requests/            # Funções de requisição
├── assets/                      # Imagens e recursos
├── .env                         # Variáveis de ambiente (não commitado)
├── .env.example                 # Template de variáveis de ambiente
├── app.config.js                # Configuração do Expo (usa .env)
├── eas.json                     # Configuração EAS Build
└── package.json                 # Dependências do projeto
```

