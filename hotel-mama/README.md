# Hotel Mama - Sistema de Gestión Hotelera

Un sistema completo de gestión hotelera construido con Next.js, que incluye gestión de huéspedes, servicios de alimentación, y más.

## Características

- 🏨 Gestión de huéspedes y habitaciones
- 🍽️ Sistema de pedidos de comida
- 📝 Formularios de feedback y preferencias
- 🌐 Soporte multilingüe (Español e Inglés)
- 📱 Diseño responsive
- 🔒 Autenticación segura

## Tecnologías Utilizadas

- Next.js 15
- React 19
- Prisma (ORM)
- PostgreSQL
- TailwindCSS
- TypeScript

## Requisitos Previos

- Node.js 18 o superior
- PostgreSQL
- npm o pnpm

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/hotel-mama.git
   cd hotel-mama
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   pnpm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` con tus configuraciones.

4. Ejecuta las migraciones de la base de datos:
   ```bash
   npx prisma migrate dev
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   pnpm dev
   ```

## Estructura del Proyecto

```
hotel-mama/
├── app/              # Rutas y páginas de la aplicación
├── components/       # Componentes reutilizables
├── lib/             # Utilidades y configuraciones
├── prisma/          # Esquema y migraciones de la base de datos
└── public/          # Archivos estáticos
```

## Despliegue

La aplicación está optimizada para ser desplegada en Vercel. Sigue estos pasos:

1. Sube tu código a GitHub
2. Conecta tu repositorio con Vercel
3. Configura las variables de entorno en Vercel
4. ¡Despliega!

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## Licencia

[MIT](LICENSE) 