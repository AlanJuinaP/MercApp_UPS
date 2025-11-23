import {ref} from 'vue';

export function useApi(baseUrl) {
    const data = ref(null);
    const loading = ref(fasle);
    const error = ref(null);

    async function get(endpoint) {
        loading.value = true;
        error.value = null;
        try {
            const res = await fetch(`${baseUrl}${endpoint}`);
            if(!res.ok) throw new Error('Error en la solicitud');
            data.value = await res.json();
        } catch (err) {
            error.value = err;
        } finally { loading.value = false; }
        return { data, loading, error };
    }

    async function post(endpoint, body) {
        const res = await fetch(`${baseUrl}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return res.json();
    }
    return { data, loading, error, get, post };
}           