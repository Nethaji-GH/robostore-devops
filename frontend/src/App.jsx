import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://54.83.127.72:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load products");
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">

      <header className="header">

        <div className="logo">
          🤖 RoboStore
        </div>

        <nav>
          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
        </nav>

        <button className="cart">
          🛒 Cart
        </button>

      </header>

      <main>

        <section className="hero" id="home">

          <div>

            <h1>
              Welcome to RoboStore
            </h1>

            <p>
              Discover robotics kits, smart robots,
              drones and automation products.
            </p>

            <button className="shop-button">
              Explore Products
            </button>

          </div>

          <div className="robot">
            🤖
          </div>

        </section>


        <section className="products" id="products">

          <h2>
            Our Robotics Products
          </h2>

          {loading && (
            <p className="message">
              Loading products...
            </p>
          )}

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <div className="product-grid">

            {products.map((product) => (

              <div
                className="product-card"
                key={product.id}
              >

                <div className="product-image">
                  🤖
                </div>

                <h3>
                  {product.name}
                </h3>

                <p>
                  {product.description}
                </p>

                <div className="product-bottom">

                  <strong>
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </strong>

                  <button>
                    Add to Cart
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>


        <section className="about" id="about">

          <h2>
            About RoboStore
          </h2>

          <p>
            RoboStore is an online robotics marketplace
            built as a three-tier DevOps project using
            React, Node.js, MySQL, Docker, Jenkins and AWS.
          </p>

        </section>

      </main>


      <footer>

        <p>
          © 2026 RoboStore | Robotics & Automation
        </p>

      </footer>

    </div>
  );
}

export default App;