class Product {
  //   title = "DEFAULT";
  //   imageUrl;
  //   description;
  //   price;

  constructor(title, imageUrl, description, price) {
    this.title = title; //this는 Product를 호출하면 Product 객체를 의미함
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }
}

class ElementAtrribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Component {
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render();
    }
  }

  render() {}

  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if (cssClasses) {
      rootElement.className = cssClasses;
    }
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

class ShoppingCart extends Component {
  items = [];

  set cartItems(value) {
    this.items = value;
    this.totalOutput.innerHTML = `<h2>Total : \$${this.totalAmount.toFixed(
      2
    )}</h2>`;
  } //부동소숫점 출력 방지 toFixed()

  get totalAmount() {
    const sum = this.items.reduce((prevValue, curItem) => {
      return prevValue + curItem.price;
    }, 0);
    return sum;
  }

  constructor(renderHookId) {
    super(renderHookId, false);
    this.orederProducts = () => {
      console.log("주문중./..");
      console.log(this.items);
    };
    this.render();
  }

  addProduct(product) {
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.cartItems = updatedItems;
  }

  render() {
    const cartEl = this.createRootElement("section", "cart");
    cartEl.innerHTML = `
        <h2>Total : \$${0}</h2>
        <button>Order Now!</button>
        `;
    const orederButton = cartEl.querySelector("button");
    // orederButton.addEventListener("click", () => this.orederProducts());
    orederButton.addEventListener("click", this.orederProducts);
    this.totalOutput = cartEl.querySelector("h2");
  }
}

//단일 아이템의 렌더링을 담당하는 클래스
//데이터를 묶으면 안되고 단일 상품 아이템을 렌더링 함
class ProductItem extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  addToCart() {
    App.addProductToCart(this.product);
  }

  render() {
    const prodEl = this.createRootElement("li", "product-item");

    prodEl.innerHTML = `
                <div>
                <div class = "product-item__content">
                    <h2>${this.product.title}</h2>
                    <h3>\$${this.product.price}</h3>
                    <p>${this.product.description}</p>
                    <button>Add to Cart</button>
                </div>
                 </div>
                `;
    const addCartButton = prodEl.querySelector("button");
    addCartButton.addEventListener("click", this.addToCart.bind(this));
    //나중에 생성되는 객체나 클래스가 아니라 버튼에 바인딩 하기 때문에
    //bind this를 추가해서 addToCart에 바인딩 해야함
  }
}

class ProductList extends Component {
  #products = []; // ProductList 내부에서만 사용 가능함
  //private의 좋은 예시

  constructor(renderHookId) {
    super(renderHookId, false);
    this.render();
    this.fetchProducts();

    //먼저 super를 미틍로 해야함 부모 요소는 render를 호출하고 여기에는
    //데이터가 필요하기 때문에 의존적인 것을 알고 있기 때문
  }

  fetchProducts() {
    this.#products = [
      new Product("A pillow", "www.asdhfjkasdhkfja", "A soft Pillow! ", 19.99),
      new Product(
        "A Carpet",
        "www.asdhfjkasdhkfjasdgfjhasdkjghs",
        "카펫! ",
        89.99
      ),
    ];
    this.renderProducts();
  }

  renderProducts() {
    for (const prod of this.#products) {
      new ProductItem(prod, "prod-list");
    }
  }

  render() {
    this.createRootElement("ul", "product-list", [
      new ElementAtrribute("id", "prod-list"),
    ]);
    if (this.products && this.#products.length > 0) {
      this.renderProducts();
    }
  }
}
class Shop {
  constructor() {
    this.render();
    //기본클래스에서 아무것도 필요하지 않기 때문에 확장안해도됨
    //1번째 방법 기본 클래스 다른 기능은 신경안쓰기때문에
  }
  render() {
    this.cart = new ShoppingCart("app");

    new ProductList("app");
  }
}

class App {
  static cart;

  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }
  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}

App.init();
