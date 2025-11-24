<template>
    <div>
        <h1>Catálogo</h1>

        <input v-model="q" placeholder="Buscar..." />

        <select v-model="category">
        <option value="">Todas</option>
        <option v-for="c in categories" :key="c._id" :value="c._id">
            {{ c.name }}
        </option>
        </select>

        <div v-if="loading">Cargando...</div>

        <div v-else>
        <div v-if="filtered.length === 0">No hay productos</div>

        <div class="grid">
            <ProductCard
            v-for="p in filtered"
            :key="p._id"
            :product="p"
            @added="addToCart"
            />
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import ProductCard from "../components/ProductCard.vue";

const q = ref("");
const category = ref("");
const products = ref([]);
const categories = ref([]);
const loading = ref(false);

onMounted(async () => {
    loading.value = true;

    const prodRes = await fetch("http://localhost:4000/api/products");
    products.value = await prodRes.json();

    const catRes = await fetch("http://localhost:4000/api/categories");
    categories.value = await catRes.json();

    loading.value = false;
});

const filtered = computed(() => {
    return products.value.filter((p) => {
        const matchesQ =
        q.value === "" ||
        (p.name + " " + (p.description || ""))
            .toLowerCase()
            .includes(q.value.toLowerCase());

        const matchesCat =
        !category.value ||
        p.categoryId == category.value ||
        p.categoryId?._id == category.value;

        return matchesQ && matchesCat;
    });
});

function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const found = cart.find((i) => i._id === product._id);

    if (found) found.qty++;
    else cart.push({ ...product, qty: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Añadido al carrito");
}
</script>
