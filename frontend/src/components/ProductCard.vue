<template>
    <div class="card">
        <img
        :src="product.imageUrl || 'https://via.placeholder.com/200'"
        style="width:100%; border-radius:8px;"
        />

        <h3>{{ product.name }}</h3>
        <p>\${{ product.price }}</p>

        <button @click="goDetail">Ver detalles</button>
        <button @click="emitAdd">Añadir al carrito</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const props = defineProps({
    product: { type: Object, required: true }
});
const emit = defineEmits(['added']);

function goDetail() {
    router.push(`/product/${props.product._id}`);
}

function emitAdd() {
    emit('added', props.product);
}
</script>
