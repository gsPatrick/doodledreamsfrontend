<template>
  <div class="produtos-list">
    <!-- Barra de busca e filtros -->
    <div class="filters">
      <div class="search-bar">
        <input
          type="text"
          v-model="busca"
          placeholder="Buscar produtos..."
          @input="debounceSearch"
        />
        <font-awesome-icon icon="search" />
      </div>

      <select v-model="tipo" @change="buscarProdutos">
        <option value="">Todos os tipos</option>
        <option value="livro">Livros</option>
        <option value="brinquedo">Brinquedos</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <font-awesome-icon icon="spinner" spin />
      <p>Carregando produtos...</p>
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="error">
      <font-awesome-icon icon="exclamation-circle" />
      <p>{{ error }}</p>
      <button @click="buscarProdutos">Tentar novamente</button>
    </div>

    <!-- Lista de produtos -->
    <div v-else class="produtos-grid">
      <div v-for="produto in produtos" :key="produto.id" class="produto-card">
        <img :src="produto.imagem" :alt="produto.nome" />
        <div class="produto-info">
          <h3>{{ produto.nome }}</h3>
          <p class="descricao">{{ produto.descricao }}</p>
          <p class="preco">R$ {{ produto.preco.toFixed(2) }}</p>
          <button class="btn-adicionar" @click="adicionarAoCarrinho(produto)">
            <font-awesome-icon icon="shopping-cart" />
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>

    <!-- Paginação -->
    <div class="paginacao">
      <button :disabled="pagina === 1" @click="mudarPagina(pagina - 1)">
        <font-awesome-icon icon="chevron-left" />
      </button>
      <span>Página {{ pagina }}</span>
      <button :disabled="pagina >= totalPages" @click="mudarPagina(pagina + 1)">
        <font-awesome-icon icon="chevron-right" />
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import debounce from 'lodash/debounce'
import produtoService from '@/services/produtoService'

export default {
  name: 'ProdutosList',

  setup() {
    const busca = ref('')
    const tipo = ref('')
    const pagina = ref(1)
    const limite = ref(12)
    const produtos = ref([])
    const totalProdutos = ref(0)
    const isLoading = ref(false)
    const error = ref(null)

    // Método para buscar produtos
    const buscarProdutos = async () => {
      isLoading.value = true
      error.value = null
      try {
        const params = {
          page: pagina.value,
          limit: limite.value,
          search: busca.value,
          categoria: tipo.value, // Assumindo que o filtro 'tipo' no front corresponde a 'categoria' no back
        }
        const data = await produtoService.getProdutos(params)
        produtos.value = data.produtos.map(p => ({ // Mapeando para o formato que o card espera
            id: p.id,
            nome: p.nome,
            descricao: p.descricao,
            variacoes: p.variacoes || [],
            imagens: p.imagens || (p.ArquivoProdutos?.filter(f => f.tipo === 'imagem').map(img => img.url) || []),
            imagem: p.imagens?.[0] || p.ArquivoProdutos?.find(f => f.tipo === 'imagem')?.url || 'https://via.placeholder.com/300'
        }))
        totalProdutos.value = data.total
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
        error.value = 'Falha ao carregar produtos. Tente novamente.'
      } finally {
        isLoading.value = false
      }
    }

    // Debounce para a busca
    const debounceSearch = debounce(() => {
      pagina.value = 1 // Reset para primeira página
      buscarProdutos()
    }, 500)

    // Método para mudar página
    const mudarPagina = novaPagina => {
      if(novaPagina > 0 && (novaPagina - 1) * limite.value < totalProdutos.value) {
        pagina.value = novaPagina
        buscarProdutos()
      }
    }

    // Método para adicionar ao carrinho
    const adicionarAoCarrinho = produto => {
      // Implementar lógica do carrinho
      console.log('Adicionar ao carrinho:', produto)
    }

    // Carregar produtos ao montar o componente
    onMounted(() => {
      buscarProdutos()
    })

    const totalPages = computed(() => Math.ceil(totalProdutos.value / limite.value))

    return {
      busca,
      tipo,
      pagina,
      limite,
      produtos,
      isLoading,
      error,
      totalPages,
      buscarProdutos,
      debounceSearch,
      mudarPagina,
      adicionarAoCarrinho,
    }
  },
}
</script>

<style lang="scss">
@use 'sass:color';

.produtos-list {
  padding: 20px;
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.search-bar {
  position: relative;
  flex: 1;

  input {
    width: 100%;
    padding: 10px 40px 10px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
  }

  .fa-search {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
  }
}

select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
}

.loading,
.error {
  text-align: center;
  padding: 40px;

  .fa-spinner,
  .fa-exclamation-circle {
    font-size: 40px;
    margin-bottom: 20px;
    color: #666;
  }
}

.error {
  color: #dc3545;

  button {
    margin-top: 20px;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background-color: #dc3545;
    color: white;
    cursor: pointer;

    &:hover {
      background-color: color.adjust(#dc3545, $lightness: -10%);
    }
  }
}

.produtos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.produto-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .produto-info {
    padding: 15px;

    h3 {
      margin: 0 0 10px;
      font-size: 18px;
    }

    .descricao {
      color: #666;
      margin-bottom: 10px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .preco {
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 15px;
    }

    .btn-adicionar {
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 8px;
      background-color: #42b983;
      color: white;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      &:hover {
        background-color: color.adjust(#42b983, $lightness: -10%);
      }
    }
  }
}

.paginacao {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  button {
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: white;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      background-color: #f8f9fa;
    }
  }

  span {
    font-size: 16px;
    color: #666;
  }
}
</style>
