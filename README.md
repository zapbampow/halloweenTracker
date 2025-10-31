# 🎃 Halloween Trick-or-Treater Tracker

A spooky web application to track trick-or-treaters visiting your house on Halloween night! Built with Node.js, SQLite, and HTMX with a festive Halloween theme.

## Features

### 🎃 Counter Page
- Full-screen Halloween-themed interface with animated background
- Large, dramatic text display: "You are the [nth] trick or treater tonight!"
- Press **Enter** to count a new trick-or-treater
- Real-time count updates with spooky animations
- Proper ordinal formatting (1st, 2nd, 3rd, 4th, etc.)

### 📊 Stats Page  
- Interactive bar chart showing trick-or-treater activity per minute
- Summary cards with total visitors, peak count, peak time, and active minutes
- Minute-by-minute breakdown starting from the first visitor
- Halloween-themed styling with hover effects
- Auto-refresh functionality

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: SQLite
- **Frontend**: HTML, CSS, HTMX
- **Styling**: Halloween-themed CSS with Google Fonts (Creepster, Nosifer)

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

### 3. Open the Application
- **Counter Page**: http://localhost:1031
- **Stats Page**: http://localhost:1031/stats

## API Endpoints

### POST /api/record
Adds a new trick-or-treater record with current timestamp.
- **Response**: `{ count: number }` - Total count of all records

### GET /api/stats  
Returns minute-by-minute activity data.
- **Response**: Array of `{ time: "HH:MM", count: number }` objects

### GET /api/count
Returns the current total count of trick-or-treaters.
- **Response**: `{ count: number }`

## Usage

1. **Start the server** before trick-or-treaters arrive
2. **Keep the counter page open** on a device near your door
3. **Press Enter** each time trick-or-treaters visit
4. **View the stats page** to see activity patterns throughout the night
5. **Navigate between pages** using the navigation links

## File Structure

```
halloweenTracker/
├── backend/
│   ├── package.json          # Node.js dependencies
│   ├── server.js             # Express server with SQLite
│   └── halloween_tracker.db  # SQLite database (auto-created)
└── frontend/
    ├── index.html            # Counter page
    └── stats.html            # Statistics page
```

## Halloween Theme Features

- 🎃 Spooky color scheme (oranges, reds, blacks)
- 👻 Animated floating Halloween emojis
- 💀 Custom Halloween fonts (Creepster, Nosifer)
- 🦇 Flickering and glowing text effects
- 🕷️ Gradient animations and Halloween atmosphere

## Customization

You can easily customize:
- **Colors**: Edit the CSS color variables
- **Fonts**: Change the Google Fonts imports
- **Animation speed**: Adjust CSS animation durations
- **Background**: Add your own background image to the counter page

Happy Halloween! 🎃👻