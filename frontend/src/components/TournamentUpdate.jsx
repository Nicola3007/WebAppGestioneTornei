import React, {useState} from "react";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import "../styles/TournamentUpdate.css";


function TournamentUpdate(){


    const API_URL = import.meta.env.VITE_API_TOURNAMENTS_URL;
    const location = useLocation();
    const navigate = useNavigate();
    const tournament = location.state.params.tournament;

    const [formData, setFormData] = useState({
        name: tournament.name,
        type: tournament.type,
        isPrivate: tournament.isPrivate,
        startDate: new Date(tournament.startDate).toISOString().split('T')[0],
        endDate: new Date(tournament.endDate).toISOString().split('T')[0],
        location: tournament.location,
        deadline: tournament.deadline ? new Date(tournament.deadline).toISOString().split('T')[0] : "",
        description: tournament.description,
        prize: tournament.prize,
        quotaIscrizione: tournament.quotaIscrizione,
        maxTeams: tournament.maxTeams,
        status: tournament.status,
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const {name, value, checked, type} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem("accessToken");
        setLoading(true);
        try{
            const response = await fetch(`${API_URL}/updateTournament/${tournament._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                ...formData,
                maxTeams: Number(formData.maxTeams),
                quotaIscrizione: Number(formData.quotaIscrizione),
                isPrivate: formData.isPrivate === true || formData.isPrivate === "true",
                }),
        });

            if (!response.ok) {
                const errMsg = await response.json()
                setError(errMsg.message);
                setLoading(false);
                throw new Error(errMsg.toString());
            }



     const updateTournaments = await response.json();
     setSuccess(true);
    }catch(error){
            console.error("Errore nella fetch: ", error);
        }
};

    return (
        <div className="update-tournament">
            <h1>Modifica Torneo</h1>
            <button type="button" className="back-button" onClick={()=> navigate(-1)}>Annulla Modifiche</button>
            <form onSubmit={handleUpdate}>
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
                    {loading ? "Modifiche in corso..." : "Salva modifiche"}
                </button>



            </form>
            {success && <Navigate to="/my-tournaments" /> }
            {error && <div className="error">{error}</div>}
        </div>
    )


}

export default TournamentUpdate;