// https://5e-bits.github.io/docs/api/
import { mapApiResponseToSupportedFormat } from './transform'

const api = 'https://www.dnd5eapi.co'

const headers = new Headers()
headers.append('Accept', 'application/json')

const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers
}

const request = async (endpoint) => {
    return await fetch(`${api}/api/${endpoint}`, requestOptions)
        .then(response => response.json())
        .then(response => response)
        .catch(error => console.log('error', error))
}

export const fetchMonsters = async () => (
    request('monsters')
)

export const fetchSpecificMonster = async (id) => {
    const response = await request(`monsters/${id}`)

    return mapApiResponseToSupportedFormat(response)
}