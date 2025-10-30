<script setup lang="ts">
import { useNotes } from '~/composables/useNotes'

const { notes, create, update, remove, clearAll, ready } = useNotes()

const title = ref('')
const content = ref('')
const editingId = ref<string | null>(null)

function startEdit(n:any) {
  editingId.value = n.id
  title.value = n.title
  content.value = n.content
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function save() {
  if (!title.value.trim() && !content.value.trim()) return
  if (editingId.value) {
    await update(editingId.value, { title: title.value, content: content.value })
    editingId.value = null
  } else {
    await create(title.value, content.value)
  }
  title.value = ''
  content.value = ''
}

function cancelEdit() {
  editingId.value = null
  title.value = ''
  content.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <header class="sticky top-0 z-10 bg-sky-600 text-white shadow">
      <div class="max-w-3xl mx-auto flex items-center justify-between p-4">
        <h1 class="text-xl font-semibold">Notas Rápidas</h1>
        <button class="px-3 py-1 rounded bg-white/20 hover:bg-white/30" @click="clearAll">
          Limpiar
        </button>
      </div>
    </header>

    <main class="max-w-3xl mx-auto p-4 space-y-6">
      <section class="bg-white rounded-2xl shadow p-4 space-y-3">
        <h2 class="text-lg font-medium" v-if="!editingId">Nueva nota</h2>
        <h2 class="text-lg font-medium" v-else>Editar nota</h2>
        <input
          v-model="title"
          type="text"
          placeholder="Título"
          class="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring focus:ring-sky-200"
        />
        <textarea
          v-model="content"
          rows="4"
          placeholder="Escribe tu nota..."
          class="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring focus:ring-sky-200"
        />
        <div class="flex gap-2">
          <button class="px-4 py-2 rounded-xl bg-sky-600 text-white hover:bg-sky-700" @click="save">
            {{ editingId ? 'Guardar cambios' : 'Agregar nota' }}
          </button>
          <button v-if="editingId" class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300" @click="cancelEdit">
            Cancelar
          </button>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium">Tus notas</h2>
        <p v-if="(notes?.length ?? 0) === 0" class="text-slate-500">No hay notas. Crea la primera arriba.</p>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <li v-for="n in notes" :key="n.id" class="bg-white rounded-2xl shadow p-4">
            <div class="flex items-start justify-between gap-3">
              <h3 class="font-semibold break-words">{{ n.title || 'Sin título' }}</h3>
              <div class="flex gap-2 shrink-0">
                <button class="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200" @click="startEdit(n)">Editar</button>
                <button class="px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700" @click="remove(n.id)">Borrar</button>
              </div>
            </div>
            <p class="mt-2 text-slate-600 whitespace-pre-wrap break-words">{{ n.content }}</p>
            <p class="mt-3 text-xs text-slate-400">
              Actualizada: {{ new Date(n.updatedAt).toLocaleString() }}
            </p>
          </li>
        </ul>
      </section>
    </main>

    <footer class="text-center text-slate-400 text-sm py-6">
      Funciona offline · Instálala desde el navegador para usarla como app
    </footer>
  </div>
</template>

<style>
/* Tailwind-like minimal reset (no Tailwind to keep it dependency-free) */
* { box-sizing: border-box; }
html, body, #__nuxt { height: 100%; }
body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; }
.bg-slate-50 { background: #f8fafc; }
.bg-slate-100 { background: #f1f5f9; }
.bg-slate-200 { background: #e2e8f0; }
.bg-sky-600 { background: #0284c7; }
.bg-sky-700 { background: #0369a1; }
.bg-white { background: #fff; }
.bg-rose-600 { background: #e11d48; }
.bg-rose-700 { background: #be123c; }
.text-white { color: #fff; }
.text-slate-400 { color: #94a3b8; }
.text-slate-500 { color: #64748b; }
.text-slate-600 { color: #475569; }
.rounded-2xl { border-radius: 1rem; }
.rounded-xl { border-radius: 0.75rem; }
.shadow { box-shadow: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06); }
.p-4 { padding: 1rem; } .px-3 { padding-left: .75rem; padding-right: .75rem; } .py-2 { padding-top: .5rem; padding-bottom: .5rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; } .py-1 { padding-top: .25rem; padding-bottom: .25rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.min-h-screen { min-height: 100vh; }
.max-w-3xl { max-width: 48rem; } .mx-auto { margin-left: auto; margin-right: auto; }
.space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: .75rem; }
.space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
.grid { display: grid; } .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.md\:grid-cols-2 { }
@media (min-width: 768px) { .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.gap-2 { gap: .5rem; } .gap-3 { gap: .75rem; }
.flex { display: flex; } .items-center { align-items: center; } .items-start { align-items: flex-start; } .justify-between { justify-content: space-between; }
.w-full { width: 100%; }
.outline-none { outline: none; }
.focus\:ring:focus { box-shadow: 0 0 0 3px rgba(14,165,233,0.35); }
.rounded { border-radius: .5rem; }
.text-xl { font-size: 1.25rem; } .text-lg { font-size: 1.125rem; } .text-sm { font-size: .875rem; }
.font-semibold { font-weight: 600; } .font-medium { font-weight: 500; }
.mt-2 { margin-top: .5rem; } .mt-3 { margin-top: .75rem; }
.break-words { word-break: break-word; overflow-wrap: anywhere; }
.sticky { position: sticky; } .top-0 { top: 0; } .z-10 { z-index: 10; }
.text-center { text-align: center; }
.hover\:bg-sky-700:hover { background: #0369a1; }
.hover\:bg-white\/30:hover { background: rgba(255,255,255,.3); }
.hover\:bg-slate-200:hover { background: #e2e8f0; }
.hover\:bg-rose-700:hover { background: #be123c; }
</style>
