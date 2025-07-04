# Doodle Dreams - E-commerce de Livros Ilustrados

Doodle Dreams é um e-commerce especializado em livros ilustrados e educativos inspirados nas coleções do estilo Bobbie Goods, com foco em um público diverso (infantil, juvenil e adulto). O site apresenta uma estética acolhedora, mágica e inspiradora, com elementos visuais delicados, ilustrações leves e cores suaves.

## Tecnologias Utilizadas

- Vue 3 (Composition API)
- Vite
- Vue Router
- Vuex
- Axios
- SCSS
- FontAwesome

## Estrutura do Projeto

```
/src
  /assets
    /images - Imagens e ilustrações
    /scss - Arquivos de estilo SCSS
  /components - Componentes reutilizáveis
  /router - Configuração de rotas
  /services - Serviços de API
  /store - Gerenciamento de estado com Vuex
  /views - Páginas da aplicação
```

## Funcionalidades

- **Home page** com banner principal, destaques e seção de assinatura
- **Catálogo de Produtos** com filtros por faixa etária, coleção e preço
- **Página de Produto** com galeria de imagens, descrição e recomendações
- **Carrinho de Compras** com gerenciamento de itens e cupons de desconto
- **Checkout** com formulário de endereço e opções de pagamento
- **Cadastro/Login** de usuário com perfil e histórico de pedidos
- **Assinatura** com planos mensais e trimestrais
- **Newsletter** para cadastro de e-mail

## Estilo Visual

- Estética acolhedora, inspiradora e artística
- Influência boho e infantil
- Tipografia amigável e elegante
- Imagens em estilo desenho à mão
- Layout limpo com bastante respiro
- Sombras suaves e cantos arredondados
- Cores em tons pastel e fundos claros

## Instalação e Execução

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/doodle-dreams.git
cd doodle-dreams
```

2. Instale as dependências
```bash
npm install
```

3. Execute o servidor de desenvolvimento
```bash
npm run dev
```

4. Acesse o site em `http://localhost:5173`

## Build para Produção

```bash
npm run build
```

Os arquivos otimizados para produção serão gerados na pasta `dist`.

## Responsividade

O site foi desenvolvido seguindo a abordagem Mobile First, garantindo uma experiência consistente em dispositivos móveis, tablets e desktops.

## Acessibilidade

Foram implementadas práticas de acessibilidade como:
- Contraste adequado entre texto e fundo
- Textos alternativos para imagens
- Navegação por teclado
- Estrutura semântica de HTML
- Foco visível em elementos interativos

