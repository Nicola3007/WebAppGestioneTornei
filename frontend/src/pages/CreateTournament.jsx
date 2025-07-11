import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./../styles/CreateTournament.css";

function CreateTournament() {


       const [ formData, setFormData ] = useState({
        name: "",
        type: "",
        isPrivate: false,
        startDate: "",
        endDate: "",
        location: "",
        deadline: "",
        description: "",
        prize: "",
        quotaIscrizione: "",
        maxTeams: "",
        status: "",
    });

    const API_URL=import.meta.env.VITE_API_BASE_URL;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const accessToken= localStorage.getItem("accessToken");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value, checked, type} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const accessToken = localStorage.getItem("accessToken");

        try{
            console.log("Access Token:", accessToken);
            console.log("formData inviato:", formData);
            const response = await fetch(`${API_URL}/api/tournaments/createTournament` , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    ...formData,
                    isPrivate: formData.isPrivate === true || formData.isPrivate === "true",
                    quotaIscrizione: Number(formData.quotaIscrizione),
                    maxTeams: Number(formData.maxTeams),
                    }),
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Errore dal server:", errorData.message);
                setError(errorData.message);
                setLoading(false);
                return;
            }


            const createdTournament = await response.json();
            setSuccess(true);

            setFormData({
                name: "",
                type: "",
                isPrivate: false,
                startDate: "",
                endDate: "",
                location: "",
                deadline: "",
                description: "",
                prize: "",
                quotaIscrizione: "",
                maxTeams: "",
                status: "",
            });

        } catch (err){
            console.error("Errore nella fetch: ", err);
        }
    };


    return (
        <div className="create-tournament">
            <h1>Crea nuovo torneo</h1>
            <button type="button" className="back-button" onClick={()=> navigate(-1)}>Torna indietro</button>
            <form onSubmit={handleSubmit}>
                <label>Nome torneo</label>
                <input
                    name="name"
                    type="text"
                    placeholder="Nome torneo"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <label>Tipo di competizione</label>
                <select
                    name="type"
                    type="text"
                    value={formData.type}
                    onChange={handleChange}>
                    <option value="">Seleziona tipo torneo...</option>
                    <option value="Eliminazione diretta">Eliminazione diretta</option>
                    <option value="Girone all'italiana">Girone all'italiana</option>
                </select>

                <label>Privato:</label>
                <select
                    name="isPrivate"
                    value={formData.isPrivate ? "true" : "false"}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            isPrivate: e.target.value === "true",
                        }))
                    }
                >
                    <option value="true">Sì</option>
                    <option value="false">No</option>
                </select>
                <label>Data inizio</label>
                <input
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                />
                <label>Data fine</label>
                <input
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                />
                <label>Luogo</label>
                <input
                    name="location"
                    type="text"
                    placeholder="Luogo"
                    value={formData.location}
                    onChange={handleChange}
                    required
                />
                <label>Deadline iscrizioni</label>
                <input
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                />
                <label>Descrizione</label>
                <textarea
                    name="description"
                    placeholder="Descrizione torneo"
                    value={formData.description}
                    onChange={handleChange}
                />
                <label>Premio</label>
                <input
                    name="prize"
                    type="text"
                    placeholder="Premio"
                    value={formData.prize}
                    onChange={handleChange}
                    required
                />
                <label>Quota iscrizione (€)</label>
                <input
                    name="quotaIscrizione"
                    type="number"
                    placeholder="Quota"
                    value={formData.quotaIscrizione}
                    onChange={handleChange}
                />
                <label>Numero massimo squadre</label>
                <select
                    name="maxTeams"
                    type="number"
                    value={formData.maxTeams}
                    onChange={handleChange} required
                >
                <option value="">Seleziona...</option>
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="16">16</option>
                <option value="32">32</option>
                </select>

                <button type="submit" disabled={loading}>
                    {loading ? "Creazione in corso..." : "Crea torneo"}
                </button>
                </form>

            {success && <Navigate to="/tornei" />}

            {error && <div className="error">{error}</div>}
        </div>
    );
}

export default CreateTournament;