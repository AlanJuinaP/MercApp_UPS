<template>
    <div>
        <h1>Carrito de compras</h1>

        <div v-if="cart.length === 0">
        <p>Tu carrito está vacío.</p>
        </div>

        <div v-else class="card" v-for="item in cart" :key="item._id" style="margin-bottom:16px;">
        <h3>{{ item.name }}</h3>
        <p>Precio: ${{ item.price }}</p>
        <p>Cantidad: {{ item.qty }}</p>

        <button @click="increment(item)">+</button>
        <button @click="decrement(item)">-</button>
        <button @click="removeItem(item)">Eliminar</button>
        </div>

        <div v-if="cart.length > 0" style="margin-top:20px;">
        <h2>Total: ${{ total }}</h2>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const cart = ref([]);

onMounted(() => {
    cart.value = JSON.parse(localStorage.getItem("cart") || "[]");
});

function updateLocal() {
    localStorage.setItem("cart", JSON.stringify(cart.value));
}

function increment(item) {
    item.qty++;
    updateLocal();
}

function decrement(item) {
    if (item.qty > 1) item.qty--;
    else removeItem(item);
    updateLocal();
    }

function removeItem(item) {
    cart.value = cart.value.filter(i => i._id !== item._id);
    updateLocal();
}

const total = computed(() =>
  cart.value.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2)
);
</script>
