<template>
    <div>
        <h1>Catálogo</h1>
        <input v-model="q" placeholder="Buscar..." />
        <select v-model="category">
        <option value="">Todas</option>
        <option v-for="c in categories" :key="c._id" :value="c._id">{{ c.name }}</option>
        </select>

        <div v-if="loading">Cargando...</div>
        <div v-else>
        <div v-if="filtered.length === 0">No hay productos</div>
        <div class="grid">
            <ProductCard v-for="p in filtered" :key="p._id" :product="p" @added="addToCart" />
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import { useApi } from '../composables/useApi';

const api = useApi('http://localhost:4000/api');
const q = ref('');
const category = ref('');
const products = ref([]);
const categories = ref([]);
const loading = ref(false);

async function load(){
    loading.value = true;
    const res1 = await api.get('/products');
    const res2 = await api.get('/categories');
    products.value = api.data.value || [];
    categories.value = api.data.value || []; // careful: use separate instances; for simplicity call api twice
    loading.value = false;
}

onMounted(async ()=> {
    // fetch products and categories separately to avoid overwriting api.data - simple approach:
    const prodRes = await fetch('http://localhost:4000/api/products');
    products.value = await prodRes.json();
    const catRes = await fetch('http://localhost:4000/api/categories');
    categories.value = await catRes.json();
});

const filtered = computed(() => {
    return products.value.filter(p => {
        const matchesQ = q.value === '' || (p.name + ' ' + (p.description||'')).toLowerCase().includes(q.value.toLowerCase());
        const matchesCat = !category.value || (p.categoryId && p.categoryId == category.value) || (p.categoryId && p.categoryId._id == category.value);
        return matchesQ && matchesCat;
    });
});

function addToCart(product) {
  // emitir evento global o usar localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const found = cart.find(i => i._id === product._id);
    if(found) found.qty++;
    else cart.push({ ...product, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Añadido al carrito');
}
</script>