# Banquet Hall Booking System

A comprehensive full-stack web application for booking banquet halls with multi-level admin approval workflow, real-time availability management, and integrated payment processing.

## 🎯 Features

### Customer Features
- **Hall Exploration**: Browse and filter banquet halls by location, capacity, and availability
- **360° Views**: Interactive panoramic views of halls
- **Easy Booking**: Simple multi-step booking process
- **Booking Management**: Track booking status and payment status
- **Document Management**: Upload and manage required documents
- **Payment Integration**: Secure mock payment processing
- **Invoice Generation**: Download booking confirmations and invoices

### Admin Features
- **Multi-Level Approval Workflow**:
  - **Admin1**: Initial verification & document validation
  - **Admin2**: Availability checking & payment request
  - **Admin3**: Final approval & confirmation
- **Dashboard**: Real-time statistics and booking overview
- **Booking Management**: Review, approve, reject, or request changes
- **Audit Trail**: Complete action history for compliance
- **Role-Based Access Control**: Secure role-based permissions

### Technical Features
- Clean Architecture: Organized folder structure with separation of concerns
- Database: PostgreSQL with Prisma ORM
- Authentication: Secure session-based authentication with password hashing
- API Routes: RESTful API with proper error handling
- Type Safety: Full TypeScript implementation
- Responsive Design: Mobile-first UI with shadcn/ui components
- Audit Logging: Complete action tracking for security

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Session-based with PBKDF2 hashing
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI, shadcn/ui
- **Utilities**: date-fns, lucide-react icons

## 📁 Folder Structure

```
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── bookings/          # Booking management
│   │   ├── halls/             # Hall exploration
│   │   ├── payments/          # Payment processing
│   │   └── admin/             # Admin operations
│   ├── admin/                 # Admin pages
│   │   ├── page.tsx           # Dashboard
│   │   └── bookings/          # Booking management
│   ├── customer/              # Customer pages
│   │   ├── halls/             # Hall browsing
│   │   └── dashboard/         # Booking dashboard
│   ├── auth/                  # Auth pages
│   │   ├── login/
│   │   └── register/
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── components/
│   ├── auth/                  # Auth components
│   ├── admin/                 # Admin components
│   ├── customer/              # Customer components
│   ├── bookings/              # Booking components
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── auth/                  # Auth utilities
│   ├── middleware/            # Custom middleware
│   ├── services/              # Business logic
│   ├── db/                    # Database client
│   ├── types/                 # TypeScript types
│   └── constants/             # App constants
├── prisma/
│   └── schema.prisma          # Database schema
├── scripts/
│   └── seed.ts                # Database seeding
└── public/                    # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd banquet-hall-booking
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your database URL and configuration
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed the database with test data
npx ts-node scripts/seed.ts
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Test Accounts

### Admin Accounts
| Role | Email | Password |
|------|-------|----------|
| SuperAdmin | superadmin@banquet.com | SuperAdmin@123 |
| Admin1 | admin1@banquet.com | Admin1@123 |
| Admin2 | admin2@banquet.com | Admin2@123 |
| Admin3 | admin3@banquet.com | Admin3@123 |

### Customer Account
| Role | Email | Password |
|------|-------|----------|
| Customer | customer@example.com | Customer@123 |

## 🔄 Approval Workflow

1. **Customer** submits a booking request with:
   - Event details (type, date, time)
   - Selected halls
   - Guest count

2. **Admin1** (Verification) reviews:
   - Customer documents
   - Event details validity
   - Can approve → move to Admin2 or request changes

3. **Admin2** (Availability & Payment) checks:
   - Hall availability
   - Payment details
   - Can request payment or move to Admin3

4. **Admin3** (Final Approval) reviews:
   - All documents and approvals
   - Payment confirmation
   - Makes final approval or rejection

5. **Booking Confirmed**: Customer receives confirmation and invoice

## 📊 Database Schema

### Core Models
- **User**: Customers and admins with role-based access
- **BanquetHall**: Hall information, amenities, pricing
- **Booking**: Booking requests with status tracking
- **BookingHall**: Many-to-many relationship for hall selection
- **Payment**: Payment tracking and status
- **Document**: Customer document uploads
- **AdminApproval**: Multi-level approval tracking
- **AuditLog**: Complete action history

### Enums
- **UserRole**: CUSTOMER, ADMIN1, ADMIN2, ADMIN3, SUPERADMIN
- **BookingStatus**: PENDING, CHANGE_REQUESTED, APPROVED, REJECTED, PAYMENT_REQUESTED, PAYMENT_COMPLETED, CONFIRMED
- **EventType**: WEDDING, CORPORATE_EVENT, BIRTHDAY, ANNIVERSARY, CONFERENCE, CONCERT, OTHER
- **PaymentStatus**: PENDING, INITIATED, COMPLETED, FAILED, REFUNDED

## 🔐 Security Features

- **Password Hashing**: PBKDF2 with salt for secure password storage
- **Session Management**: HTTP-only cookies with secure flag
- **Role-Based Access Control**: Middleware-enforced permissions
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **Audit Logging**: Complete action tracking
- **Authorization**: Row-level access checks on sensitive operations

## 💳 Payment Integration (Extensible)

The system includes a mock payment implementation ready for integration with:
- **Razorpay**: Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- **Stripe**: Add `STRIPE_PUBLIC_KEY` and `STRIPE_SECRET_KEY`

Current implementation uses mock payment IDs for demonstration.

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS responsive utilities
- Responsive navigation with mobile menu
- Touch-friendly UI components
- Optimized for all screen sizes

## 🎨 Theming

The application uses Tailwind CSS v4 with semantic design tokens:
- Primary color: Modern blue (#3b82f6)
- Neutral colors: Gray scale
- Accessible contrast ratios
- Dark mode support ready

## 🧪 Testing

### Test Booking Flow
1. Login as customer (customer@example.com)
2. Browse halls on /customer/halls
3. Create a booking
4. Login as Admin1 to verify
5. Login as Admin2 to check availability
6. Login as Admin3 to approve
7. Process payment

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/status` - Check authentication status

### Halls
- `GET /api/halls` - List all halls with filters

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user's bookings
- `GET /api/bookings/[id]` - Get booking details
- `PATCH /api/bookings/[id]` - Update booking status

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/bookings` - Admin's pending bookings

### Payments
- `POST /api/payments` - Initiate payment
- `POST /api/payments/[id]/verify` - Verify payment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 📞 Support

For support, please open an issue on the repository or contact support@banquethalls.com

## 🚀 Deployment

### Vercel Deployment
```bash
# Push to GitHub
git push origin main

# Deploy to Vercel
vercel deploy
```

### Environment Setup on Vercel
1. Add DATABASE_URL to environment variables
2. Run migrations: `npx prisma migrate deploy`
3. Seed database: `npx ts-node scripts/seed.ts`

## 📈 Future Enhancements

- [ ] Real Razorpay/Stripe integration
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Advanced analytics
- [ ] Customer reviews and ratings
- [ ] Virtual tour integration
- [ ] Calendar synchronization
- [ ] Bulk admin operations
- [ ] Custom pricing rules
- [ ] Promotional codes

---

**Built with ❤️ using Next.js and Tailwind CSS**
