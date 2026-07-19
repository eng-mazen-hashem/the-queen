# 📄 Product Requirements Document (PRD) - Queen's Attara

## 1. System Context & Agent Directives
**Role:** You are an Expert Senior Full-Stack Developer and Architect.
**Mission:** Build a custom, highly optimized e-commerce platform for "Queen's Attara" (عطارة الملكة) from scratch. Focus on clean architecture, high performance (SEO & Speed), scalability, and an outstanding User Experience (UX) tailored for the Arab market.

## 2. Project Overview
* **Project Name:** Queen's Attara (عطارة الملكة)
* **Objective:** Build a lightning-fast, Mobile-First, and scalable e-commerce store dedicated to selling herbs, spices, and organic products.
* **Target Audience:** Housewives, professional chefs, alternative medicine enthusiasts.
* **Localization:** Primary Interface: Fully Arabic (RTL). Architecture must support English (LTR) integration in the future via i18n.
* **Infrastructure:** Deployment on **Hostinger** with a custom domain.

## 3. Tech Stack Requirements
* **Frontend:** `Next.js` + `Tailwind CSS` (RTL support) + `Framer Motion`.
* **Backend:** `Node.js` with `Express.js` OR `Next.js API Routes`.
* **Database:** `PostgreSQL` managed via `Prisma ORM`.
* **Media:** `Cloudinary` or local WebP optimization.
* **Authentication:** `NextAuth.js`.

## 4. Core Features (MVP)
1. **Dynamic Weight & Pricing System:** Products must support multiple weight variants (e.g., 50g, 100g, 1kg with different prices).
2. **Advanced Categorization & Search:** Benefit-based keyword search (e.g., "Immunity booster").
3. **Optimized Cart & Checkout:** Side Drawer Cart and One-Page Checkout.
4. **Admin Dashboard:** For managing products, weight variants, and order statuses.

## 5. Deployment Instructions
* System must be designed for easy deployment on **Hostinger** Node.js environments.
* Output must include a `README.md` with CI/CD deployment steps.

## 6. Immediate Action Plan for AI Agent
**Step 1:** Initialize the project and output the **Folder Structure**.
**Step 2:** Write the complete `schema.prisma` covering Users, Products, Variants, Categories, Orders.
**Step 3:** Configure `tailwind.config.js` for RTL and an earthy color palette.