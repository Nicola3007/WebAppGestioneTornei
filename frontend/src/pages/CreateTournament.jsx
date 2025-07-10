import React, { useState } from 'react';

function CreateTournament() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        type: "Eliminazione diretta",
        startDate: "",
        endDate: "",
        deadline: "",
        prize: "",
        quotaIscrizione: "",
        maxTeams: "",
        description: "",
        isPrivate: false,
        loading: false,
        error: "",
    });

    const API_URL = import.meta.env.VITE_API_BASE_URL;
    const accessToken = localStorage.getItem("accessToken");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormData({ ...formData, loading: true, error: "" });

        try {
            const res = await fetch(`${API_URL}/createTournament`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                    location: formData.location,
                    type: formData.type,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    deadline: formData.deadline,
                    prize: formData.prize,
                    quotaIscrizione: Number(formData.quotaIscrizione),
                    maxTeams: Number(formData.maxTeams),
                    description: formData.description,
                    isPrivate: formData.isPrivate,
                }),
            });

            const data = await res.json();

            if (res.status === 400 || res.status === 500) {
                setFormData({ ...formData, loading: false, error: data.message.toString() });
                console.error("Errore:", data.message);
            } else {
                setFormData({
                    ...formData,
                    loading: false,
                    error: "",
                });
                console.log("Torneo creato con successo:", data);
                setShowForm(false);
            }

        } catch (err) {
            setFormData({ ...formData, loading: false, error: "Errore nel server" });
            console.error("Errore di rete:", err);
        }
    };

    return (
        <div className="create-tournament">
            {!showForm ? (
                <button onClick={() => setShowForm(true)}>Crea Torneo</button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h2>Nuovo Torneo</h2>

                    {formData.error && <p className="error">{formData.error}</p>}

                    <label>Nome:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                    <label>Luogo:</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} />

                    <label>Tipo:</label>
                    <input type="text" name="type" value={formData.type} onChange={handleChange} readOnly />

                    <label>Data inizio torneo:</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />

                    <label>Data fine torneo:</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />

                    <label>Scadenza iscrizioni:</label>
                    <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />

                    <label>Premio:</label>
                    <input type="text" name="prize" value={formData.prize} onChange={handleChange} required />

                    <label>Quota iscrizione (€):</label>
                    <input type="number" name="quotaIscrizione" value={formData.quotaIscrizione} onChange={handleChange} />

                    <label>Numero massimo squadre:</label>
                    <select name="maxTeams" value={formData.maxTeams} onChange={handleChange}>
                        <option value="">-- Seleziona --</option>
                        <option value={4}>4</option>
                        <option value={8}>8</option>
                        <option value={16}>16</option>
                        <option value={32}>32</option>
                    </select>

                    <label>Descrizione:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange}></textarea>

                    <label>
                        <input type="checkbox" name="isPrivate" checked={formData.isPrivate} onChange={handleChange} />
                        Torneo privato
                    </label>

                    <button type="submit" disabled={formData.loading}>
                        {formData.loading ? "Salvataggio..." : "Salva torneo"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)}>Annulla</button>
                </form>
            )}
        </div>
    );
}

export default CreateTournament;
