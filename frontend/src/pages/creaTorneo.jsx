import { useState } from "react";

function CreateTournament(){

    const API_URL = import.meta.env.VITE_API_BASE_URL;
    console.log(API_URL);

    const [form, setForm] = useState({
        name: "",
        type: "Eliminazione diretta",
        startDate: "",
        endDate: "",
        deadline: "",
        location: "",
        description: "",
        prize: "",
        quotaIscrizione: 0,
        maxTeams: 4,
        isPrivate: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked} = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(${API_URL}/createTournament`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify(form),
            })

            const result = await response.json();
            console.log("Torneo creato", result);
            alert("Torneo creato con successo!");
        } catch (error) {
            console.log("Errore nella creazione del torneo: ", error);
            alert("Errore durante la creazione");
        }
    }
};

return (
    <div className="crea-torneo">
        <h2>Crea un nuovo torneo</h2>
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Nome torneo" onChange={handleChange} required />
            <input name="location" placeholder="Luogo" onChange={handleChange} />
            <textarea name="description" placeholder="Descrizione" onChange={handleChange} />
            <input name="prize" placeholder="Premio" onChange={handleChange} required />
            <input name="quotaIscrizione" type="number" onChange={handleChange} placeholder="Quota (€)" />

            <label>
                Data inizio:
                <input type="date" name="startDate" onChange={handleChange} required />
            </label>

            <label>
                Data fine:
                <input type="date" name="endDate" onChange={handleChange} required />
            </label>

            <label>
                Scadenza iscrizioni:
                <input type="date" name="deadline" onChange={handleChange} required />
            </label>

            <label>
                Tipo torneo:
                <select name="type" onChange={handleChange}>
                    <option value="Eliminazione diretta">Eliminazione diretta</option>
                </select>
            </label>

            <label>
                Max squadre:
                <select name="maxTeams" onChange={handleChange}>
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                    <option value={16}>16</option>
                    <option value={32}>32</option>
                </select>
            </label>

            <label>
                Torneo privato?
                <input type="checkbox" name="isPrivate" onChange={handleChange} />
            </label>

            <button type="submit">Crea Torneo</button>
        </form>
    </div>
);
}


export default CreateTournament;