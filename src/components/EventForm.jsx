import { useEffect, useState } from "react";

function formatDateForInput(dateValue) {
  if (!dateValue) {
    return "";
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
}

function formatTimeForInput(timeValue) {
  if (!timeValue) {
    return "";
  }

  const trimmedText = timeValue.trim();
  const match = trimmedText.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return trimmedText;
  }

  const [, hours, minutes, meridiem] = match;
  let hour = Number(hours);

  if (meridiem.toUpperCase() === "PM" && hour < 12) {
    hour += 12;
  }

  if (meridiem.toUpperCase() === "AM" && hour === 12) {
    hour = 0;
  }

  return `${String(hour).padStart(2, "0")}:${minutes}`;
}

function EventForm({ onAddEvent, onUpdateEvent, onCancelEdit, editingEvent }) {
  const emptyForm = {
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    description: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!editingEvent) {
      setFormData(emptyForm);
      return;
    }

    setFormData({
      title: editingEvent.title,
      category: editingEvent.category,
      date: formatDateForInput(editingEvent.date),
      time: formatTimeForInput(editingEvent.time),
      location: editingEvent.location,
      description: editingEvent.description,
    });
  }, [editingEvent]);

  function handleChange(event) {
    const inputName = event.target.name;
    const inputValue = event.target.value;

    setFormData({
      ...formData,
      [inputName]: inputValue,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      formData.title === "" ||
      formData.category === "" ||
      formData.date === "" ||
      formData.time === "" ||
      formData.location === "" ||
      formData.description === ""
    ) {
      setFormError("Please fill in every field.");
      return;
    }

    if (editingEvent) {
      const updatedEvent = {
        ...editingEvent,
        title: formData.title,
        category: formData.category,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        description: formData.description,
      };

      onUpdateEvent(updatedEvent);
      setFormError("");
      return;
    }

    const newEvent = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      description: formData.description,
    };

    onAddEvent(newEvent);
    setFormData(emptyForm);
    setFormError("");
  }

  function handleCancelEdit() {
    setFormData(emptyForm);
    setFormError("");
    onCancelEdit();
  }

  return (
    <section className="event-form-section">
      <p className="section-label">
        {editingEvent ? "Update an Activity" : "Create an Activity"}
      </p>

      <h2>{editingEvent ? "Edit Campus Event" : "Add a New Campus Event"}</h2>

      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Event Title</label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: React Workshop"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Cultural">Cultural</option>
            <option value="Club">Club</option>
            <option value="Workshop">Workshop</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>

          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time</label>

          <input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="location">Location</label>

          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="Example: Seminar Hall"
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the event"
          />
        </div>

        {formError !== "" && <p className="form-error">{formError}</p>}

        <button className="submit-button" type="submit">
          {editingEvent ? "Update Event" : "Add Event"}
        </button>

        {editingEvent && (
          <button type="button" className="cancel-button" onClick={handleCancelEdit}>
            Cancel
          </button>
        )}
      </form>
    </section>
  );
}

export default EventForm;