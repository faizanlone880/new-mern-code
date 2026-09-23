import EventForm from "../components/EventForm";
import EventSection from "../components/EventSection";
import Hero from "../components/Hero";

function HomePage({
    events,
    onAddEvent,
    onDeleteEvent,
    onEditEvent,
    onUpdateEvent,
    onCancelEdit,
    editingEvent,
}) {
    return (
        <>
            <Hero
                title="Discover what is happening in Campus"
                description="Find workshops,sports,activities,club Meeting,and opportunities to connect with other students."
            />

            <EventForm
                onAddEvent={onAddEvent}
                onUpdateEvent={onUpdateEvent}
                onCancelEdit={onCancelEdit}
                editingEvent={editingEvent}
            />

            <EventSection
                events={events}
                onDeleteEvent={onDeleteEvent}
                onEditEvent={onEditEvent}
            />
        </>
    );
}

export default HomePage;