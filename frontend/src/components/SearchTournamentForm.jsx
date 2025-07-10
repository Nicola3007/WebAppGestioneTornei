import{useState, useEffect} from 'react'
import '../styles/searchTournamentForm.css'


function SearchTournamentForm({onSubmit}) {

    const [searchForm, setSearchForm] = useState({
        id: '',
        name:'',
        location:'',
        date: null,
        isPrivate: '',
        quotaIscrizione: '',
        maxTeams: null
    })

    const [error, setError] = useState('')


    const API_URL = import.meta.env.VITE_API_TOURNAMENTS_URL;

    const handleChange = (e) => {
        const {name,  value} = e.target;
        setSearchForm({...searchForm, [name]: value});
    }
    const FormSubmit = async (e) => {
        e.preventDefault();

        let queryString = ''

        Object.entries(searchForm).forEach(([key, value]) => {
            console.log(value)
            if(value!==''&&value!== null&&value !== undefined) {
                queryString += `${key}=${value}&`
            }

        })

        queryString = queryString.slice(0,-1)

        try {
            const response = await fetch(`${API_URL}/search?${queryString}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                credentials: 'include',
            })

            let errorMsg = ''
            const data = await response.json();
            if(response.status === 404) {
            errorMsg = JSON.stringify(data.message);
                setError(errorMsg)
            }
            onSubmit(data, errorMsg)

        }catch(err){
            console.log(err)
        }
    }
    return (
        <>
            <form className="form-container" onSubmit={FormSubmit}>
                <div className='form-group'>
                <label className='form-label'>ID torneo</label>
                <input className='form-input'
                    type="text"
                    name="id"
                    placeholder="ID torneo"
                    value={searchForm.id}
                    onChange={handleChange}
                />
                </div>
                <div className='form-group'>
                    <label className='form-label'>Nome torneo</label>
                    <input className='form-input'
                    type="text"
                    name="name"
                    placeholder="Nome"
                    value={searchForm.name}
                    onChange={handleChange}
                />
                </div>
                <div className='form-group'>
                    <label className='form-label'>Luogo torneo</label>
                    <input className='form-input'
                        type="text"
                        name="location"
                        placeholder="Luogo"
                        value={searchForm.location}
                        onChange={handleChange}
                    />
                </div>
                <div className='form-group'>
                    <label className='form-label'>Data torneo</label>
                    <input className='form-input'
                        type="date"
                        name="date"
                        value={searchForm.date}
                        onChange={handleChange}
                    />
                </div>

                <select className='form-select'
                    name="isPrivate"
                    value={searchForm.isPrivate}
                        onChange={handleChange}
                >
                    <option value=''>Entrambi</option>
                    <option value='true'>Privato</option>
                    <option value='false'>Pubblico</option>
                </select>
                <select className='form-select'
                    name="quotaIscrizione"
                    value={searchForm.quotaIscrizione}
                    onChange={handleChange}
                >
                        <option value=''>Entrambi</option>
                    <option value="true">Gratis</option>
                    <option value="false">A pagamento</option>
                </select>
                <select className='form-select' value={searchForm.maxTeams} onChange={handleChange}>
                    <option value=''>Tutti</option>
                    <option value={4}>4</option>
                    <option value={8}>8</option>
                    <option value={16}>16</option>
                    <option value={32}>32</option>
                </select>
                <div className='form-actions'>
                <button className='form-button' type="submit">Cerca torneo</button>
                </div>
            </form>
        </>
    )
}
 export default SearchTournamentForm;