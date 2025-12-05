# Blue Star Equity Group v2

A modern, responsive website for Blue Star Equity Group - a private equity firm focused on strategic acquisitions and ground-up ventures.

![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-teal)
![Firebase](https://img.shields.io/badge/Firebase-10.7-orange)

## 🌟 Features

- **Modern Single Page Application**: Built with React and Vite for optimal performance
- **Responsive Design**: Fully responsive across all devices using Tailwind CSS
- **Firebase Integration**: Real-time job listings and authentication
- **Admin Dashboard**: Secure job posting and management system
- **Portfolio Showcase**: Dynamic portfolio companies with hiring indicators
- **Career Portal**: Searchable and filterable job listings
- **GitHub Pages Ready**: Automatic deployment via GitHub Actions

## 🚀 Live Demo

Once deployed, your site will be available at:
```
https://[your-username].github.io/BSEGv2/
```

## 📁 Project Structure

```
BSEGv2/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/
│   └── star-icon.svg           # Favicon
├── src/
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles and Tailwind imports
├── index.html                  # HTML template
├── package.json                # Project dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── FIREBASE_SETUP.md           # Firebase setup instructions
└── README.md                   # This file
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **Backend Services**: Firebase (Firestore + Authentication)
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Git
- Firebase account (free tier is sufficient)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/BSEGv2.git
   cd BSEGv2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase** (See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed instructions)
   - Create a Firebase project
   - Enable Firestore and Authentication
   - Update the Firebase config in `src/App.jsx`

4. **Run development server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser

## 🏗️ Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

## 🚢 Deployment

### GitHub Pages (Automatic)

1. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Under "Build and deployment", select "GitHub Actions" as the source

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

3. **Access your site**:
   - Your site will be automatically deployed to `https://[username].github.io/BSEGv2/`
   - Check the Actions tab to monitor deployment progress

### Custom Domain

To use a custom domain (e.g., `bluestarequitygroup.com`):

1. Add a `CNAME` file in the `public/` folder:
   ```
   bluestarequitygroup.com
   ```

2. Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/', // Change from '/BSEGv2/'
   })
   ```

3. Configure DNS with your domain provider:
   - Add a CNAME record pointing to `[username].github.io`
   - Or add A records pointing to GitHub Pages IPs

4. In GitHub repository Settings > Pages, add your custom domain

## 🎨 Customization

### Portfolio Companies

Edit the `portfolioCompanies` array in `src/App.jsx` (around line 350):

```javascript
const portfolioCompanies = [
  {
    name: "Your Company Name",
    description: "Company description",
    icon: <YourIcon className="w-10 h-10 text-white" />,
    type: "Acquisition & Optimization",
    url: "https://yourcompany.com",
  },
  // Add more companies...
];
```

### Colors and Branding

Update Tailwind classes throughout the components or modify `tailwind.config.js` for global theme changes.

### Admin Access

Change the authorized email and code in `PrivateJobPost` component:

```javascript
const AUTHORIZED_EMAIL = "your-email@example.com";
const SIMULATED_CODE = "your-code";
```

## 🔐 Admin Features

Access the admin dashboard at `/post-job` (or click "Admin (Job Post)" in navigation):

1. **Email Authentication**: Enter the authorized email
2. **Code Verification**: Enter the 6-digit code (default: 123456)
3. **Post Jobs**: Add new job listings for portfolio companies
4. **Manage Jobs**: View and close existing job postings

## 📊 Firebase Data Structure

Jobs are stored in Firestore at:
```
/artifacts/{appId}/public/data/jobs/
  └── {jobId}
      ├── title: string
      ├── company: string
      ├── location: string
      ├── description: string
      └── datePosted: timestamp
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Build and deploy to GitHub Pages using gh-pages

### Code Quality

- Follow React best practices
- Use functional components and hooks
- Keep components focused and reusable
- Comment complex logic

## 🐛 Troubleshooting

### Firebase Errors

If you see Firebase initialization errors:
- Check that your Firebase config is correct
- Verify Firebase services (Firestore, Authentication) are enabled
- Review Firestore security rules

### GitHub Pages 404

If you get 404 errors on GitHub Pages:
- Verify the `base` path in `vite.config.js` matches your repository name
- Check that GitHub Pages is enabled and set to use GitHub Actions
- Wait a few minutes for deployment to complete

### Build Failures

If the build fails:
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (18+ required)
- Review error messages in the Actions tab

## 📝 License

This project is proprietary software. All rights reserved © 2024 Blue Star Equity Group.

## 🤝 Contributing

This is a private project. For inquiries, contact howard@bluestarequitygroup.com

## 📧 Contact

- **Website**: [Blue Star Equity Group](https://[your-domain].com)
- **Email**: info@bluestarequitygroup.com
- **Phone**: 555-555-5555

---

Built with ❤️ for Blue Star Equity Group
