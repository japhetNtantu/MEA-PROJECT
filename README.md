# 🍕 Pizza Simple App

A full-stack pizza ordering application built with **Angular** (frontend) and **FastAPI** (backend). Dependency management on the backend is handled using [`uv`](https://github.com/astral-sh/uv), a fast and modern Python package manager.

---

## 📦 Tech Stack

### Frontend
- [Angular](https://angular.io/) — SPA framework
- TypeScript

### Backend
- [FastAPI](https://fastapi.tiangolo.com/) — Modern, fast (high-performance) web framework for building APIs
- [`uv`](https://github.com/astral-sh/uv) — Python dependency management

---

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Python 3.11+
- [`uv`](https://github.com/astral-sh/uv) installed (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
- (Optional) `Docker` if using containerization

---

## 🔧 Backend Setup (FastAPI)

```bash
# Clone the repo
git clone git@github.com:japhetNtantu/MEA-PROJECT.git
cd pizza-simple-app/backend

# Install dependencies
uv pip install -r requirements.txt

# Run the backend
uvicorn main:app --reload
