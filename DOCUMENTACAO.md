# Documentação Técnica - Doodle Dreams

## Visão Geral

Doodle Dreams é um e-commerce de livros ilustrados e educativos desenvolvido com Vue 3, Vite e SCSS. O projeto segue uma arquitetura modular e utiliza as melhores práticas de desenvolvimento frontend.

## Arquitetura do Projeto

### Estrutura de Diretórios

```
/doodle-dreams
  /node_modules
  /public
  /src
    /assets
      /fonts
      /images
      /scss
        _mixins.scss
        _reset.scss
        _utilities.scss
        _variables.scss
        main.scss
    /components
      CartItem.vue
      CheckoutForm.vue
      Footer.vue
      Header.vue
      LoginForm.vue
      Notification.vue
      ProductCard.vue
      ProductDetails.vue
      ProductGallery.vue
      ProductRecommendations.vue
      RegisterForm.vue
    /router
      index.js
    /services
      api.js
      authService.js
      cartService.js
      index.js
      newsletterService.js
      productService.js
    /store
      index.js
      /modules
        auth.js
        cart.js
        products.js
    /views
      Cart.vue
      Catalog.vue
      Home.vue
      ProductDetail.vue
      (outras páginas)
    App.vue
    main.js
  .eslintrc.js
  .prettierrc
  index.html
  jsconfig.json
  package.json
  vite.config.js
```

## Tecnologias Utilizadas

### Frontend
- **Vue 3**: Framework JavaScript progressivo para construção de interfaces de usuário
- **Vite**: Build tool e servidor de desenvolvimento
- **Vue Router**: Roteamento oficial para Vue.js
- **Vuex**: Gerenciamento de estado centralizado para Vue.js
- **Axios**: Cliente HTTP baseado em Promises para fazer requisições
- **SCSS**: Pré-processador CSS para estilos avançados
- **FontAwesome**: Biblioteca de ícones vetoriais

### Ferramentas de Desenvolvimento
- **ESLint**: Ferramenta de linting para identificar e reportar padrões no código
- **Prettier**: Formatador de código para manter consistência

## Componentes Principais

### Layout
- **Header.vue**: Cabeçalho com navegação, busca e ícone do carrinho
- **Footer.vue**: Rodapé com links úteis, redes sociais e newsletter

### Produtos
- **ProductCard.vue**: Card de produto para listagens
- **ProductGallery.vue**: Galeria de imagens do produto
- **ProductDetails.vue**: Detalhes do produto (título, descrição, preço)
- **ProductRecommendations.vue**: Produtos recomendados

### Carrinho e Checkout
- **CartItem.vue**: Item individual no carrinho
- **CheckoutForm.vue**: Formulário de finalização de compra

### Autenticação
- **LoginForm.vue**: Formulário de login
- **RegisterForm.vue**: Formulário de cadastro

## Serviços

### API
- **api.js**: Configuração base do Axios com interceptors para mock de API
- **productService.js**: Serviço para operações relacionadas a produtos
- **cartService.js**: Serviço para operações do carrinho de compras
- **authService.js**: Serviço para autenticação e gerenciamento de usuários
- **newsletterService.js**: Serviço para inscrição na newsletter

## Store (Vuex)

### Módulos
- **products.js**: Gerenciamento de estado para produtos
- **cart.js**: Gerenciamento de estado para o carrinho
- **auth.js**: Gerenciamento de estado para autenticação

## Estilos (SCSS)

### Arquivos Base
- **_variables.scss**: Variáveis para cores, tipografia, espaçamento, etc.
- **_mixins.scss**: Mixins para responsividade, flexbox, etc.
- **_reset.scss**: Reset CSS para normalização entre navegadores
- **_utilities.scss**: Classes utilitárias para uso comum

## Rotas

O sistema de rotas é configurado em `/src/router/index.js` e inclui:

- `/`: Página inicial
- `/catalogo`: Catálogo de produtos
- `/catalogo/:categoria`: Catálogo filtrado por categoria
- `/produto/:id`: Página de detalhes do produto
- `/carrinho`: Carrinho de compras
- `/checkout`: Finalização de compra
- `/login`: Página de login
- `/cadastro`: Página de cadastro
- `/perfil`: Perfil do usuário
- `/assinatura`: Página de assinatura

## Funcionalidades Implementadas

### Catálogo de Produtos
- Listagem de produtos
- Filtros por categoria, faixa etária, preço
- Ordenação por relevância, preço, mais vendidos

### Página de Produto
- Galeria de imagens com zoom e carrossel
- Informações detalhadas do produto
- Botão de adicionar ao carrinho
- Produtos recomendados

### Carrinho de Compras
- Adição/remoção de produtos
- Atualização de quantidades
- Aplicação de cupons de desconto
- Cálculo de subtotal, desconto e total

### Autenticação
- Login de usuário
- Cadastro de novo usuário
- Perfil com histórico de pedidos

### Checkout
- Formulário de endereço
- Seleção de método de pagamento
- Resumo do pedido

### Newsletter
- Cadastro de e-mail para newsletter

## Responsividade

O site foi desenvolvido seguindo a abordagem Mobile First, com breakpoints definidos para diferentes tamanhos de tela:

- **sm**: 576px
- **md**: 768px
- **lg**: 992px
- **xl**: 1200px

Utilizamos mixins SCSS para facilitar a implementação de estilos responsivos:

```scss
@include respond-to(md) {
  // Estilos para telas médias e maiores
}
```

## Acessibilidade

Implementamos as seguintes práticas de acessibilidade:

- Uso de HTML semântico
- Atributos ARIA quando necessário
- Contraste adequado entre texto e fundo
- Foco visível em elementos interativos
- Textos alternativos para imagens

## Otimização de Performance

- Lazy loading de imagens
- Code splitting por rota
- Minificação de CSS e JavaScript
- Compressão de imagens

## Considerações Finais

O projeto Doodle Dreams foi desenvolvido seguindo as melhores práticas de desenvolvimento frontend, com foco em usabilidade, acessibilidade e performance. A arquitetura modular facilita a manutenção e extensão do código no futuro.

