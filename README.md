# CS Learning Hub – DSA Edition

A concept-centric, static learning platform for Data Structures & Algorithms. This project centralizes resources, tracks your progress, and stores your personal notes locally in your browser.

![Preview](preview.png)
*(Note: Add a screenshot here if you like!)*

## 🚀 How to Run Locally

Since this is a static site that fetches JSON data, you cannot simply double-click `index.html`. Browsers block local file access for security (CORS). You need a simple local server.

### Option 1: Using Python (Recommended)
If you have Python installed, open a terminal in this folder and run:

```bash
python -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: Using Node.js
If you have Node.js installed:

```bash
npx serve .
```
Then open the URL shown in the terminal (usually http://localhost:3000).

---

## 📖 How to Use

1. **The Dashboard**: 
   - You'll see cards for different DSA concepts (Arrays, Linked Lists, etc.).
   - The color indicates your status: **Gray** (New), **Yellow** (Learning), **Green** (Mastered).
   - Use the progress bar at the top to track your overall journey.

2. **Concept Page**:
   - Click any card to enter the deep-dive view.
   - **Resources**: Watch the curated videos or read the guides.
   - **Visualizer**: Interact with the embedded visualizer to "see" the algorithm in action.
   - **Notes**: Write your thoughts in the "My Notes" box. These are **auto-saved** to your browser's LocalStorage.
   - **Status**: Change the dropdown status to "Learning" or "Mastered".

3. **Learning Path**:
   - Check the "Next Concepts" section at the bottom of a page to see what you should learn next based on dependencies (e.g., learn "Arrays" before "Stacks").

---

## ☁️ How to Host (Free)

This site is perfect for **GitHub Pages** or **Netlify**.

### GitHub Pages (Easiest)
1.  Create a new repository on GitHub.
2.  Push this entire folder to the repository.
3.  Go to **Settings** > **Pages**.
4.  Under "Branch", select `main` (or `master`) and save.
5.  Your site will be live at `https://your-username.github.io/repo-name/`.

### Netlify / Vercel
1.  Drag and drop this folder onto the Netlify/Vercel dashboard.
2.  It will be deployed instantly.

---

## 🛠️ Tech Stack
- **HTML5 & CSS3** (Custom Design System)
- **Vanilla JavaScript** (ES6+)
- **JSON** (Data Layer)
- **LocalStorage** (Persistence)
- **No Build Step Required** - purely static!
