const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Suporte a imagens externas (se estiver usando Firebase Storage ou similares)
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },

  // Configuração de alias para importações limpas
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },

  // Configuração para futuras otimizações
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
