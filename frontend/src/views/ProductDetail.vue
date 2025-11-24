<template>
    <div v-if="loading">Cargando...</div>

    <div v-else-if="product" class="card" style="max-width:600px; margin:auto;">
        <img
        :src="product.imageUrl || 'https://via.placeholder.com/300'"
        style="width:100%; border-radius:8px;"
        />

        <h2>{{ product.name }}</h2>
        <p>{{ product.description }}</p>
        <p><strong>Precio:</strong> ${{ product.price }}</p>

        <button @click="addToCart(product)">Añadir al carrito</button>
    </div>

    <div v-else>
        <h2>Producto no encontrado</h2>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const product = ref(null);
const loading = ref(true);

onMounted(async () => {
    const id = route.params.id;
    const res = await fetch(`http://localhost:4000/api/products/${id}`);
    
    if (res.ok) {
        product.value = await res.json();
    } else {
        product.value = null;
    }

    loading.value = false;
});

function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const found = cart.find((i) => i._id === product._id);

    if (found) found.qty++;
    else cart.push({ ...product, qty: 1 });

    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Producto añadido al carrito");
}
</script>
