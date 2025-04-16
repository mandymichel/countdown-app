import React, { useState, useEffect } from "react"

const API_BASE = "https://m2fptvl5ai.execute-api.us-east-1.amazonaws.com" // replace with your real API URL

function App() {
  const [events, setEvents] = useState([])
  const [eventName, setEventName] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [loading, setLoading] = useState(true)

  const COLORS = [
    "#007bff",
    "#28a745",
    "#17a2b8",
    "#ffc107",
    "#6610f2",
    "#dc3545",
    "#20c997",
  ]

  const EMOJIS = [
    { keyword: "birthday", emoji: "🎂" },
    { keyword: "school", emoji: "🎓" },
    { keyword: "vacation", emoji: "🏖️" },
    { keyword: "wedding", emoji: "💍" },
    { keyword: "christmas", emoji: "🎄" },
    { keyword: "new year", emoji: "🎉" },
    { keyword: "meeting", emoji: "📅" },
    { keyword: "exam", emoji: "📝" },
    { keyword: "trip", emoji: "✈️" },
  ]

  const getEmojiForEvent = (name) => {
    const match = EMOJIS.find((e) => name.toLowerCase().includes(e.keyword))
    return match
      ? match.emoji
      : ["🌟", "🎯", "💡", "🕒", "🚀", "🎈"][Math.floor(Math.random() * 6)]
  }

  const getRandomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]

  // Fetch events on load
  useEffect(() => {
    fetch(`${API_BASE}/events`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data)
        setLoading(false)
      })
      .catch((err) => console.error("Fetch error:", err))
  }, [])

  const handleAdd = async () => {
    if (!eventName || !eventDate) return

    const res = await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName, eventDate }),
    })

    if (res.ok) {
      // Refresh events
      const updated = await fetch(`${API_BASE}/events`).then((res) =>
        res.json()
      )
      setEvents(updated)
      setEventName("")
      setEventDate("")
    } else {
      alert("Failed to add event")
    }
  }

  const handleDelete = async (id) => {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      setEvents(events.filter((e) => e.eventId !== id))
    } else {
      alert("Failed to delete")
    }
  }

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: 600,
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>📅 Countdown App</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          style={{
            flex: "1 1 200px",
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          style={{
            flex: "1 1 150px",
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            flex: "0 0 auto",
          }}
        >
          Add
        </button>
      </div>

      <h2>Upcoming Events</h2>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events yet!</p>
      ) : (
        <>
          {events.map((event) => {
            const [year, month, day] = event.eventDate.split("-")
            const formattedDate = new Date(
              year,
              month - 1,
              day
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })

            const emoji = getEmojiForEvent(event.eventName)
            const bgColor = getRandomColor()

            return (
              <div
                key={event.eventId}
                style={{
                  backgroundColor: bgColor,
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "1rem",
                  marginBottom: "1rem",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  transition: "0.3s all ease",
                }}
              >
                <h2 style={{ margin: 0 }}>
                  {emoji} {event.eventName}
                </h2>
                <p style={{ margin: "0.5rem 0" }}>{formattedDate}</p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={{ margin: 0 }}>{event.daysLeft} days left</p>
                  <button
                    onClick={() => handleDelete(event.eventId)}
                    style={{
                      backgroundColor: "#fff",
                      color: bgColor,
                      border: "none",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

export default App
