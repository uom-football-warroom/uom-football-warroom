# UOM Football War Room — Current Project Status

**Status date:** 2026-08-01  
**Current branch deployed:** `main`  
**Latest deployed commit observed:** `471d264` — Merge pull request #4 from `phase01ci`

---

## 1. Project Goal

UOM Football War Room is a football fan engagement platform. The planned system includes:

- Club and fixture browsing
- Favourite-club onboarding
- Match War Rooms
- Moderation and reporting
- Prediction system using virtual coins
- Loyalty tiers and leaderboards
- Admin tools
- AI-generated pre-match insights

The project is divided into six main phases.

---

## 2. Main Project Plan

| Phase | Planned scope | Current status |
|---|---|---|
| Phase 01 | Authentication, club and fixture data, favourite-club onboarding, profile, initial deployment | **Nearly complete** |
| Phase 02 | Match War Room and reporting | Not started |
| Phase 03 | Wallet and predictions | Not started |
| Phase 04 | Loyalty system and leaderboards | Not started |
| Phase 05 | Admin and moderation tools | Not started |
| Phase 06 | AI pre-match service using FastAPI | Not started |

### Overall position

The project has completed most of the Phase 01 development work and the first manual server deployment. Five major phases still remain after Phase 01.

---

## 3. Phase 01 — Completed Development Work

### Authentication and user flow

- Supabase authentication connected.
- Registration flow implemented.
- Numerical email OTP verification implemented.
- Login flow implemented.
- Protected-page redirects implemented.
- Registration flow continues from OTP verification to onboarding.
- User profile page implemented.
- Profile editing added.
- Logout flow implemented.

### Favourite-club onboarding

- Club onboarding page created.
- Real club records loaded from PostgreSQL through Prisma.
- Users can choose multiple favourite clubs.
- Favourite-club selections are saved through the onboarding API.
- Support profile creation is handled when required.

### Club functionality

- Clubs are stored in PostgreSQL.
- Club data is accessed through Prisma.
- `GET /api/clubs` implemented.
- `GET /api/clubs/[id]` implemented.
- Clubs listing page implemented.
- Club details page implemented.
- Club logos and external crest URLs supported.

### Fixture functionality

- Fixtures are stored in PostgreSQL.
- `GET /api/fixtures` implemented.
- `GET /api/fixtures/[id]` implemented.
- Fixtures listing page implemented.
- Fixture details page implemented.
- Proper not-found handling added.

### Data synchronization

- Club synchronization service implemented.
- Fixture synchronization service implemented.
- Protected admin synchronization endpoint implemented.
- `CRON_SECRET` authorization added.
- Public club and fixture pages read from the database rather than calling the football API directly.

### Database and Prisma

- PostgreSQL hosted on Supabase.
- Prisma ORM configured.
- `DATABASE_URL` used by the application runtime.
- `DIRECT_URL` used by Prisma migrations.
- Database migrations created and applied.
- Seed and sync data tested.
- Custom generated Prisma client stored under `generated/prisma`.

### UI and layout

- Shared Navbar retained.
- Shared Footer retained.
- Login page completed.
- Registration page completed.
- Club listing and club details pages completed.
- Fixture listing and fixture details pages completed.
- Profile page completed.
- Favourite-club onboarding page completed.

---

## 4. CI and Repository Work Completed

- Phase 01 backend work merged into `main`.
- Docker deployment configuration merged into `main`.
- GitHub Actions CI workflow added.
- CI checks include:
  - dependency installation
  - Prisma client generation
  - TypeScript checking
  - ESLint
  - production build
- CI workflow passed before being merged.
- Docker build was tested locally before server deployment.

---

## 5. Docker Work Completed

### Files added

- `Dockerfile`
- `.dockerignore`
- `compose.yaml`

### Docker behavior

- Next.js standalone output enabled.
- Application runs in a Docker container.
- Application is bound to:

```text
127.0.0.1:3000
```

- Port `3000` is not exposed directly to the public internet.
- Prisma migrations use a separate one-time `migrate` service.
- Normal startup uses the `app` service.

### Correct deployment commands

```bash
docker compose build
docker compose run --rm migrate
docker compose up -d app
```

---

## 6. DigitalOcean Deployment Completed

### Droplet

- DigitalOcean Droplet created in the Bangalore region.
- Ubuntu 24.04 LTS installed.
- Public IPv4 configured.
- SSH key authentication configured.

### Server security

- Initial root SSH access verified.
- Non-root user `deploy` created.
- `deploy` added to the `sudo` group.
- SSH key access copied to the `deploy` user.
- Sudo permission tested successfully.
- UFW firewall enabled.
- Allowed ports:
  - `22` for SSH
  - `80` for HTTP
  - `443` for HTTPS
- Port `3000` remains private.

### Server resources

- Server packages updated.
- Server rebooted after updates.
- 2 GB swap file created and enabled.
- Swap persists after reboot through `/etc/fstab`.

### Installed software

- Docker Engine
- Docker Compose plugin
- Git
- Nginx

### Repository deployment

- Repository cloned into:

```text
/opt/uom-football-warroom
```

- `main` branch checked out.
- Production `.env` created on the server.
- `.env` permissions restricted to `600`.
- Docker images built successfully.
- Prisma migrations executed successfully.
- Next.js application started successfully.

### Application verification

The following checks passed:

```bash
curl -I http://127.0.0.1:3000
```

Returned:

```text
HTTP/1.1 200 OK
```

The clubs API also returned real club data from Supabase:

```bash
curl http://127.0.0.1:3000/api/clubs
```

This confirms:

- Docker container is running.
- Next.js is responding.
- Application can connect to Supabase PostgreSQL.
- Prisma queries work in production.
- Club API works from the deployed server.

### Nginx

- Nginx installed and running.
- Reverse-proxy configuration created.
- Nginx receives traffic on port `80`.
- Nginx forwards requests internally to `127.0.0.1:3000`.
- Public access through the Droplet IP was tested.

Request flow:

```text
Browser
  ↓
Droplet port 80
  ↓
Nginx
  ↓
127.0.0.1:3000
  ↓
Next.js Docker container
  ↓
Supabase PostgreSQL
```

---

## 7. What Is Still Needed to Fully Finish Phase 01

### 1. Buy or obtain a domain

A domain has not yet been connected.

Example:

```text
uomfootballwarroom.com
```

### 2. Configure DNS

The domain must point to the Droplet public IPv4 using an `A` record.

```text
Type: A
Host: @
Value: Droplet public IPv4
```

A second record can be added for `www`.

### 3. Update Nginx for the domain

Change:

```nginx
server_name <server-ip>;
```

To:

```nginx
server_name your-domain.com www.your-domain.com;
```

### 4. Enable HTTPS

Install Certbot and generate a free Let's Encrypt certificate.

The final public URL should use:

```text
https://your-domain.com
```

### 5. Update production environment variables

Change:

```env
NEXT_PUBLIC_APP_URL=http://<server-ip>
```

To:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Because this is a public Next.js build variable, rebuild the app afterward.

### 6. Update Supabase authentication URLs

In Supabase authentication settings, configure:

- Production Site URL
- Allowed redirect URLs
- OTP confirmation redirect URL

These should use the final HTTPS domain.

### 7. Run full production acceptance tests

Test the complete production flow:

1. Open the home page.
2. Register a new account.
3. Receive the numerical OTP.
4. Verify the OTP.
5. Complete favourite-club onboarding.
6. Open the profile page.
7. Edit the profile.
8. Browse clubs.
9. Open a club details page.
10. Browse fixtures.
11. Open a fixture details page.
12. Log out.
13. Log in again.
14. Confirm protected redirects work.

### 8. Schedule data synchronization

The synchronization endpoint exists, but automatic scheduled execution still needs to be configured.

Possible options:

- DigitalOcean/server cron
- GitHub Actions scheduled workflow
- External cron service

The endpoint must send:

```text
Authorization: Bearer <CRON_SECRET>
```

### 9. Add basic monitoring

At minimum:

- Check container status.
- Check Nginx status.
- Review Docker logs.
- Review Nginx logs.
- Monitor disk and memory usage.

Useful commands:

```bash
docker compose ps
docker compose logs --tail=100 app
sudo systemctl status nginx
free -h
df -h
```

### 10. Add automatic deployment later

Automatic CD is not yet configured.

Recommended order:

1. Complete and verify manual production deployment.
2. Confirm HTTPS and authentication work.
3. Create a new branch for CD.
4. Add a GitHub Actions deployment workflow.
5. Store deployment secrets in GitHub Actions secrets.
6. Deploy automatically after successful CI on `main`.

---

## 8. Distance From the Main Project Plan

### Phase 01

Phase 01 is **nearly finished**.

Development is mostly complete. The remaining work is mainly production completion and validation:

- domain
- DNS
- HTTPS
- Supabase production redirect settings
- full production authentication testing
- automatic data synchronization
- monitoring
- optional CD workflow

### Entire project

The full project is still in an early stage because the plan has six major phases.

Current position:

```text
Phase 01: Nearly complete
Phase 02: Not started
Phase 03: Not started
Phase 04: Not started
Phase 05: Not started
Phase 06: Not started
```

The foundation is now strong enough to begin Phase 02 after Phase 01 production verification is completed.

---

## 9. Recommended Immediate Next Actions

Complete these in this order:

1. Obtain a domain.
2. Point DNS to the Droplet.
3. Change Nginx `server_name` to the domain.
4. Install Certbot and enable HTTPS.
5. Update `NEXT_PUBLIC_APP_URL`.
6. Rebuild and restart the Docker app.
7. Update Supabase Site URL and redirect URLs.
8. Test registration, OTP, onboarding, profile, club and fixture flows.
9. Configure scheduled club and fixture synchronization.
10. Add monitoring.
11. Mark Phase 01 complete.
12. Start Phase 02 planning.

---

## 10. Deployment Update Procedure for Future Manual Releases

After code is merged into `main`, connect to the server and run:

```bash
cd /opt/uom-football-warroom
git pull origin main
docker compose build
docker compose run --rm migrate
docker compose up -d app
docker compose ps
curl -I http://127.0.0.1:3000
```

When environment variables change, confirm the `.env` file first and rebuild the app.

Never commit `.env` or production secrets to GitHub.

---

## 11. Current Conclusion

The Phase 01 application foundation is working in production on a DigitalOcean Droplet. The application container, database connection, API access, firewall, swap, Docker, and Nginx reverse proxy are operational.

The largest remaining Phase 01 task is completing the public production setup with a domain, HTTPS, Supabase production authentication URLs, and full end-to-end production testing.
