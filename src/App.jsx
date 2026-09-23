import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";

import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import AboutPage from "./pages/AboutPage";

function App() {
    const [events, setEvents] = useState([]);
    const [editingEvent, setEditingEvent] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/events")
            .then((response) => response.json())
            .then((data) => {
                setEvents(data);
            });
    }, []);

    function handleAddEvent(newEvent) {
        fetch("http://localhost:5000/api/events", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(newEvent)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                fetch("http://localhost:5000/api/events")
                    .then((response) => response.json())
                    .then((updatedData) => {
                        setEvents(updatedData);
                    });
            });
    }

    function handleDeleteEvent(eventId) {
        fetch(`http://localhost:5000/api/events/${eventId}`, {
            method: "DELETE"
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                fetch("http://localhost:5000/api/events")
                    .then((response) => response.json())
                    .then((updatedData) => {
                        setEvents(updatedData);
                    });
            });
    }

    function handleEditEvent(eventId) {
        const selectedEvent = events.find((event) => event.id === eventId);
        setEditingEvent(selectedEvent ?? null);
    }

    function handleUpdateEvent(updatedEvent) {
        fetch(`http://localhost:5000/api/events/${updatedEvent.id}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(updatedEvent)
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setEvents((currentEvents) =>
                    currentEvents.map((event) =>
                        event.id === updatedEvent.id ? data.event : event
                    )
                );
                setEditingEvent(null);
            });
    }

    function handleCancelEdit() {
        setEditingEvent(null);
    }

    return (
        <div>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            events={events}
                            onAddEvent={handleAddEvent}
                            onDeleteEvent={handleDeleteEvent}
                            onEditEvent={handleEditEvent}
                            onUpdateEvent={handleUpdateEvent}
                            onCancelEdit={handleCancelEdit}
                            editingEvent={editingEvent}
                        />
                    }
                />

                <Route
                    path="/events"
                    element={
                        <EventsPage
                            events={events}
                            onDeleteEvent={handleDeleteEvent}
                        />
                    }
                />

                <Route
                    path="/events/:eventId"
                    element={
                        <EventDetailsPage
                            events={events}
                        />
                    }
                />

                <Route
                    path="/about"
                    element={<AboutPage />}
                />
            </Routes>

            <Footer />
        </div>
    );
}

export default App;