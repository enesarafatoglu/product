import React, { useState, useEffect } from "react";
import { useAuth } from "../guard/AuthProvider";
import { useEditForm } from "./EditFormContext";
import axios from "axios";
import "./products.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Products() {
  const { logout } = useAuth();
  const [cardLayout, setCardLayout] = useState("column"); //card sıralama düzenini belirlemek için
  const { editingProduct, setEditingProduct } = useEditForm();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    Name: "",
    Type: "",
    Price: 0,
    Contents: "",
    Description: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Ürünler alınırken hata oluştu:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/product/${productId}`);
      fetchProducts();
      toast.success("Ürün başarıyla silindi.");
    } catch (error) {
      console.error("Ürün silinirken hata oluştu:", error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);

    const editForm = document.querySelector(".edit-form");
    if (editForm) {
      const editFormPosition = editForm.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + editFormPosition.top - 20,
        behavior: "smooth",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (
      !editingProduct.Name ||
      !editingProduct.Type ||
      isNaN(editingProduct.Price) ||
      !editingProduct.Contents ||
      !editingProduct.Description ||
      editingProduct.Price <= 0
    ) {
      toast.error("Lütfen tüm alanları doldurun ve uygun veri girin.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/product/${editingProduct.Id}`,
        editingProduct
      );
      setEditingProduct(null);
      fetchProducts();
      toast.success("Ürün başarıyla güncellendi.");
    } catch (error) {
      console.error("Ürün güncellenirken hata oluştu:", error);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
  };

  const handleAddProduct = async () => {
    if (
      !newProduct.Name ||
      !newProduct.Type ||
      isNaN(newProduct.Price) ||
      !newProduct.Contents ||
      !newProduct.Description ||
      newProduct.Price <= 0
    ) {
      toast.error("Lütfen tüm alanları doldurun ve uygun veri girin.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/product", newProduct);
      setNewProduct({
        Name: "",
        Type: "",
        Price: 0,
        Contents: "",
        Description: "",
      });
      fetchProducts();
      toast.success("Ürün başarıyla eklendi.");
    } catch (error) {
      console.error("Ürün eklenirken hata oluştu:", error);
    }
  };

  return (
    <div className="urunler-container">
      <div className="button-container">
        <button className="logout-button" onClick={logout}>
          Çıkış Yap
        </button>
        <button className="layout-button" onClick={() => setCardLayout("row")}>
          Yan Yana Sırala
        </button>
        <button
          className="layout-button"
          onClick={() => setCardLayout("column")}
        >
          Alt Alta Sırala
        </button>
      </div>

      <div
        className={`urunler-content ${
          cardLayout === "row" ? "row-layout" : ""
        }`}
      >
        <h1 className="header">ÜRÜNLER</h1>
        <div className="card-list">
          {products.map((product) => (
            <div key={product.Id} className="card">
              <h3>{product.Name}</h3>
              <p>
                <strong>Tür:</strong> {product.Type}
              </p>
              <p>
                <strong>Fiyat:</strong> {product.Price} TL
              </p>
              <p>
                <strong>İçindekiler:</strong> {product.Contents}
              </p>
              <p>
                <strong>Açıklama:</strong> {product.Description}
              </p>
              <div className="card-buttons">
                <button
                  className="action-button"
                  onClick={() => handleEditProduct(product)}
                >
                  Güncelle
                </button>
                <button
                  className="action-button"
                  id="silme"
                  onClick={() => handleDeleteProduct(product.Id)}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="urun-ekleme">
        <h2>Ürün Ekle</h2>
        <input
          type="text"
          placeholder="Ürün Adı"
          value={newProduct.Name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, Name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Türü"
          value={newProduct.Type}
          onChange={(e) =>
            setNewProduct({ ...newProduct, Type: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Fiyat"
          value={newProduct.Price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, Price: parseFloat(e.target.value) })
          }
        />
        <input
          type="text"
          placeholder="İçindekiler"
          value={newProduct.Contents}
          onChange={(e) =>
            setNewProduct({ ...newProduct, Contents: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Açıklama"
          value={newProduct.Description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, Description: e.target.value })
          }
        />
        <button className="action-button" id="edit3" onClick={handleAddProduct}>
          Ekle
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
      {editingProduct && (
        <div className="edit-form">
          <h2>Ürün Düzenle</h2>
          <input
            type="text"
            placeholder="Ürün Adı"
            value={editingProduct.Name}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, Name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Türü"
            value={editingProduct.Type}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, Type: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Fiyat"
            value={editingProduct.Price}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                Price: parseFloat(e.target.value),
              })
            }
          />
          <input
            type="text"
            placeholder="İçindekiler"
            value={editingProduct.Contents}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                Contents: e.target.value,
              })
            }
          />
          <input
            type="text"
            placeholder="Açıklama"
            value={editingProduct.Description}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                Description: e.target.value,
              })
            }
          />
          <button
            className="action-button"
            id="edit"
            onClick={handleUpdateProduct}
          >
            Güncelle
          </button>
          <button className="action-button" id="edit2" onClick={cancelEdit}>
            İptal
          </button>
        </div>
      )}
    </div>
  );
}
