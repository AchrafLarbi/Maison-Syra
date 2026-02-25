# Maison SYRA - Django React E-commerce Platform

<div align="center">
  <img src="frontend/public/logo.png" alt="Maison SYRA Logo" style="width: 200px; margin-bottom: 20px;" />
  
  <p>
    <img alt="Django" src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" />
    <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
    <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
    <img alt="PayPal" src="https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white" />
  </p>

  <p>
    <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/romanyn36/Django-react-e-commerce?color=56BEB8">
    <img alt="Repository size" src="https://img.shields.io/github/repo-size/romanyn36/Django-react-e-commerce?color=56BEB8">
    <img alt="License" src="https://img.shields.io/github/license/romanyn36/Django-react-e-commerce?color=56BEB8">
  </p>
</div>

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 About

**Maison SYRA** is a modern, full-stack e-commerce platform built with Django REST Framework and React. This project showcases a luxury artisan marketplace with features like secure authentication, PayPal integration, admin management, and responsive design.

🌐 **Live Demo**: [Visit Maison SYRA](https://maisonsyra.vercel.app)

## ✨ Features

### 👥 User Features

- **Authentication & Authorization**
  - User registration and login with JWT tokens
  - Secure password validation
  - Profile management
- **Shopping Experience**
  - Browse products with search and pagination
  - Product details with reviews and ratings
  - Shopping cart functionality
  - Order history and tracking
- **Payment Integration**
  - PayPal payment processing
  - Secure checkout process
  - Order confirmation and receipts

### 🛠️ Admin Features

- **Product Management**
  - Add, edit, and delete products
  - Image upload with Cloudinary storage
  - Inventory management
- **Order Management**
  - View and manage all orders
  - Update order status (paid/delivered)
  - Sales analytics dashboard
- **User Management**
  - View and manage user accounts
  - Admin privileges control

### 🔧 Technical Features

- **RESTful API** with Django REST Framework
- **JWT Authentication** for secure API access
- **Responsive Design** with React Bootstrap
- **Real-time Updates** with React state management
- **Cloud Storage** integration with Cloudinary
- **Health Monitoring** with custom middleware
- **Production Ready** deployment configuration

## 🚀 Tech Stack

### Backend

- **Framework**: Django 5.0.7
- **API**: Django REST Framework
- **Authentication**: django-simple-jwt
- **Database**: PostgreSQL / SQLite (development)
- **Storage**: Cloudinary for media files
- **Payment**: PayPal integration

### Frontend

- **Framework**: React 18
- **UI Library**: React Bootstrap
- **State Management**: Redux
- **HTTP Client**: Axios
- **Styling**: Custom CSS modules + Bootstrap
- **Icons**: React Icons, Bootstrap Icons

### Deployment & DevOps

- **Backend Hosting**: Render.com
- **Frontend Hosting**: Vercel
- **Database**: Supabase PostgreSQL
- **Storage**: Cloudinary
- **Environment**: Docker support

## 📋 Prerequisites

Before running this project, make sure you have:

- **Python 3.8+**
- **Node.js 16+**
- **npm or yarn**
- **PostgreSQL** (for production)
- **Git**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/romanyn36/Django-react-e-commerce.git
cd Django-react-e-commerce
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ENV=DEVELOPMENT

# Database (Optional - uses SQLite by default)
DB_URL=postgresql://username:password@localhost:5432/database_name

# Cloudinary Storage
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret

# PayPal Configuration
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_MEDIA_URL=http://localhost:8000
REACT_APP_PAYPAL_CLIENT_ID=your-paypal-client-id
```

## 📱 Usage

### For Customers

1. **Register/Login** to your account
2. **Browse Products** using search and categories
3. **Add Items** to your cart
4. **Checkout** with PayPal payment
5. **Track Orders** in your profile

### For Administrators

1. **Login** with admin credentials
2. **Access Admin Dashboard** from the header menu
3. **Manage Products**: Add, edit, delete products
4. **Process Orders**: Update order status
5. **Manage Users**: View and manage customer accounts

## 📚 API Documentation

### Authentication Endpoints

```
POST /api/users/login/          # User login
POST /api/users/register/       # User registration
GET  /api/users/profile/        # Get user profile
PUT  /api/users/profile/update/ # Update user profile
```

### Product Endpoints

```
GET  /api/products/             # List all products
GET  /api/products/{id}/        # Get product details
POST /api/products/{id}/review/ # Create product review
GET  /api/products/top/         # Get top-rated products
```

### Order Endpoints

```
POST /api/orders/               # Create new order
GET  /api/orders/               # Get user orders
GET  /api/orders/{id}/          # Get order details
PUT  /api/orders/{id}/pay/      # Mark order as paid
PUT  /api/orders/{id}/deliver/  # Mark order as delivered
```

### Admin Endpoints

```
GET  /api/admin/orders/         # Get all orders
GET  /api/admin/users/          # Get all users
POST /api/admin/products/       # Create product
PUT  /api/admin/products/{id}/  # Update product
DELETE /api/admin/products/{id}/ # Delete product
```

## 🚀 Deployment

### Backend Deployment (Render.com)

1. **Prepare for deployment**:

   ```bash
   # Build script is included: build.sh
   chmod +x build.sh
   ./build.sh
   ```

2. **Configure Render**:

   - Build Command: `./render_build.sh`
   - Start Command: `./render_start.sh`
   - Environment: Python 3

3. **Set environment variables** on Render dashboard

### Frontend Deployment (Vercel)

1. **Build the project**:

   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   npx vercel --prod
   ```

### Database Setup (Supabase)

1. Create a new PostgreSQL database on Supabase
2. Update the `DB_URL` environment variable
3. Run migrations: `python manage.py migrate`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript code
- Write descriptive commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Larbi Mohammed Achraf** - AI Engineer & Django Developer

<p align="center">
  <a href="https://github.com/romanyn36" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://linkedin.com/in/romanyn36" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://twitter.com/romaninasrat" target="_blank">
    <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter" />
  </a>
</p>

---

<div align="center">
  <p>Made with ❤️ for the Django and React community</p>
  <p><a href="#top">⬆️ Back to Top</a></p>
</div>
