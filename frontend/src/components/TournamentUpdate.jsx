import React, {useState} from "react";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import "../styles/TournamentUpdate.css";


function TournamentUpdate(){


    const API_URL = import.meta.env.VITE_API_TOURNAMENTS_URL;
    const API_USER_URL = import.meta.env.VITE_API_USER_URL;
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
    const [errorUpdate, setErrorUpdate] = useState("");
    const [errorDelete,setErrorDelete] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleChange = (e) => {
        const {name, value, checked, type} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleDelete = async () => {
        try {
            let accessToken = localStorage.getItem("accessToken");
            const response = await fetch(`${API_URL}/deleteTournament/${tournament._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });
            if (response.status === 401) {

                const responseAccessToken = await fetch(`${API_USER_URL}/refresh`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include"
                });

                const dataNewToken = await responseAccessToken.json();

                if (responseAccessToken.status === 401) {
                    console.log('refresh token scaduto, rifare il login');
                    navigate('/login');
                    return;
                }

                accessToken = dataNewToken.accessToken;
                localStorage.setItem("accessToken", accessToken);

                return handleDelete();

            }
            if (!response.ok) {
                const errorDelete = await response.json();
                setErrorDelete(errorDelete.message || "Errore eliminazione torneo");
                return;
            }

            alert("Torneo eliminato con successo!");
            navigate("/my-tournaments");
        } catch (error) {
            console.error("Errore durante l'eliminazione: ", error);
            setErrorDelete("Errore durante l'eliminazione");
        } finally {
            setConfirmDelete(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        let accessToken = localStorage.getItem("accessToken");
        setLoading(true);

        try {
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
                }),
            });

            if (response.status === 401) {

                const responseAccessToken = await fetch(`${API_USER_URL}/refresh`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include"
                });

                const dataNewToken = await responseAccessToken.json();

                if (responseAccessToken.status === 401) {
                    console.log('refresh token scaduto, rifare il login');
                    navigate('/login');
                    return;
                }

                accessToken = dataNewToken.accessToken;
                localStorage.setItem("accessToken", accessToken);

                return handleUpdate(e);

            }

            if (!response.ok) {
                const errMsg = await response.json();
                setErrorUpdate(errMsg.message);
                setLoading(false);
                throw new Error(errMsg.toString());
            }

            setSuccess(true);
        } catch (error) {
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
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <label>Tipo di competizione</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}>
                    <option value="">Seleziona tipo torneo...</option>
                    <option value="Eliminazione diretta">Eliminazione diretta</option>
                    <option value="Girone all'italiana">Girone all'italiana</option>
                    <option value="Altro">Altro</option>
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
            {success && <Navigate to="/dashboard/my-tournaments" /> }
            {errorUpdate && <div className="error">{errorUpdate}</div>}
            <button className="delete-button" onClick={()=> setConfirmDelete(true)}>Elimina Torneo</button>
            {confirmDelete && (
                <div className="confirm-delete-box">
                    <p>Sei sicuro di voler eliminare questo torneo?</p>
                    <button onClick={handleDelete}>Conferma</button>
                    <button onClick={() => setConfirmDelete(false)}>Annulla</button>
                </div>
            )}
        </div>
    )


}

export default TournamentUpdate;