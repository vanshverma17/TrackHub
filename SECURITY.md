# 🔒 Security Guide - TrackHub

## ⚠️ Important: .env Files Already Pushed to GitHub

Your `.env` files containing sensitive information have been pushed to GitHub. Follow these steps immediately:

### Step 1: Remove .env Files from Git History

The .env files are now in `.gitignore`, but they exist in your git history. To completely remove them:

```bash
# Remove .env files from git tracking (already done)
git rm --cached backend/.env frontend/.env

# Commit the removal
git add .
git commit -m "Remove .env files from tracking and add to .gitignore"

# Push changes
git push origin master
```

### Step 2: Change All Secrets

Since your secrets were exposed on GitHub, you should change them:

#### Backend .env
```env
# Generate a new strong JWT secret
JWT_SECRET=<generate-a-new-random-32-character-string>

# If using MongoDB Atlas, rotate your password
MONGO_URI=mongodb://localhost:27017/trackhub
```

**How to generate a strong JWT secret:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString()))
```

### Step 3: Using .env.example Files

For collaborators, use the `.env.example` files:

1. **Backend**: Copy `backend/.env.example` to `backend/.env`
2. **Frontend**: Copy `frontend/.env.example` to `frontend/.env`
3. Fill in your own values

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with your values

# Frontend
cd frontend
cp .env.example .env
# Edit .env with your values
```

## 🛡️ Security Best Practices

### 1. Never Commit Sensitive Data
- Always use `.gitignore` for `.env` files
- Never hardcode API keys or passwords
- Use environment variables for all secrets

### 2. Use Strong Secrets
- JWT secrets should be at least 32 characters
- Use random, cryptographically secure strings
- Never use default or example secrets in production

### 3. Different Secrets for Different Environments
- Development, staging, and production should have different secrets
- Never use production credentials in development

### 4. MongoDB Security
If using MongoDB Atlas:
- Enable IP whitelist
- Use strong passwords
- Rotate passwords regularly
- Enable 2FA on your MongoDB Atlas account

### 5. Production Deployment
When deploying to production:
- Use environment variables on your hosting platform (Vercel, Render, Railway, etc.)
- Never commit production .env files
- Use different JWT secrets for each environment
- Enable HTTPS only
- Set secure CORS origins (not *)

## 📋 Environment Variables Reference

### Backend (.env)
```env
PORT=5000                                    # Server port
MONGO_URI=mongodb://localhost:27017/trackhub # MongoDB connection string
JWT_SECRET=your-secret-key                   # JWT signing secret (min 32 chars)
NODE_ENV=development                         # Environment (development/production)
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api      # Backend API URL
```

## 🔍 Checking for Exposed Secrets

### Scan Your GitHub Repository
Use tools to scan for exposed secrets:
- [GitGuardian](https://www.gitguardian.com/)
- [TruffleHog](https://github.com/trufflesecurity/trufflehog)
- GitHub's built-in secret scanning (if enabled)

### Clean Git History (Advanced)
If you want to completely remove secrets from git history:

```bash
# WARNING: This rewrites history and requires force push
# Use with caution, coordinate with team members

# Using git filter-branch (basic method)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/.env frontend/.env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: rewrites history)
git push origin --force --all
```

**Better approach**: Use [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
```bash
# Download BFG
# Run BFG to remove files
java -jar bfg.jar --delete-files .env

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

## ✅ Verification Checklist

After securing your repository:

- [ ] .gitignore files created for root, backend, and frontend
- [ ] .env files removed from git tracking
- [ ] .env.example files created with safe placeholder values
- [ ] All secrets changed (JWT_SECRET, database passwords, etc.)
- [ ] Changes committed and pushed to GitHub
- [ ] Verified .env files are not visible on GitHub
- [ ] Team members notified to use .env.example files
- [ ] Production environment variables configured on hosting platform

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## 🆘 Need Help?

If you believe your credentials have been compromised:
1. Immediately rotate all secrets
2. Check MongoDB logs for unauthorized access
3. Review GitHub repository access logs
4. Consider making the repository private temporarily
5. Contact your hosting provider if using cloud services

---

**Remember**: Security is an ongoing process, not a one-time task. Regularly review and update your security practices.
